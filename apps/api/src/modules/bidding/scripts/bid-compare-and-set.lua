-- Atomic bid compare-and-set.
--
-- Why this has to be a single script rather than "GET, decide in Node, SET":
-- two bids arriving in the same millisecond would both read the same
-- current_bid, both independently decide "I'm high enough", and both SET —
-- the second SET silently overwrites the first with no error, and the first
-- bidder has no idea they were actually outbid a moment later. Putting the
-- read-decide-write sequence inside one EVAL makes it atomic: Redis
-- processes one Lua script to completion before starting the next, so the
-- second bid's "read" always sees the first bid's "write."
--
-- KEYS[1] = auction:{id}:current_bid    (string-encoded integer rupees)
-- KEYS[2] = auction:{id}:current_bidder (user id)
-- ARGV[1] = proposed bid amount (integer rupees)
-- ARGV[2] = bidder's user id
-- ARGV[3] = auction's starting price (used as the floor when no bid exists yet)
--
-- Returns [success (0|1), currentValueAfterThisCall, extra, previousBidderOrEmpty]
-- where `extra` is the *previous bid amount* on success (so the caller can
-- roll back if the follow-up Postgres write fails) or the *minimum
-- acceptable bid* on failure (so the caller can tell the bidder exactly
-- what would've worked). `previousBidderOrEmpty` is read here, atomically,
-- rather than with a separate GET before/after this script runs — reading
-- it outside the script would reopen exactly the race this script exists to
-- close: by the time a separate read landed, a different bid could already
-- have changed who "previous bidder" even means.
--
-- *** Increment tiers below MUST stay in sync with
-- src/modules/auctions/auctions.constants.ts (getMinimumIncrement). This
-- duplication is deliberate, not an oversight — Lua has no way to import a
-- TypeScript module, and the whole point of this script is that the
-- decision has to be made atomically, inside Redis, not computed in Node
-- and handed over. If you change one, change the other. ***

local existed = redis.call('EXISTS', KEYS[1])
local current
if existed == 1 then
  current = tonumber(redis.call('GET', KEYS[1]))
else
  current = tonumber(ARGV[3])
end

local proposed = tonumber(ARGV[1])
local minAcceptable

if existed == 1 then
  local minIncrement
  if current >= 25000 then
    minIncrement = 1000
  elseif current >= 10000 then
    minIncrement = 500
  elseif current >= 5000 then
    minIncrement = 250
  elseif current >= 2500 then
    minIncrement = 100
  else
    minIncrement = 50 -- placeholder — see BELOW_2500_INCREMENT in auctions.constants.ts
  end
  minAcceptable = current + minIncrement
else
  -- Opening bid just needs to clear the starting price, not price+increment.
  minAcceptable = current
end

if proposed < minAcceptable then
  return { 0, tostring(current), tostring(minAcceptable), '' }
end

local previousAmount = current
local previousBidder = ''
if existed == 1 then
  previousBidder = redis.call('GET', KEYS[2]) or ''
end

redis.call('SET', KEYS[1], tostring(proposed))
redis.call('SET', KEYS[2], ARGV[2])

return { 1, tostring(proposed), tostring(previousAmount), previousBidder }
