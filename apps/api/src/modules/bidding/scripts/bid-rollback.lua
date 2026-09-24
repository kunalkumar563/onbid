-- Compensating rollback for the rare case where Redis accepted a bid but the
-- follow-up Postgres write then failed (tech stack §3: "if Redis and
-- Postgres ever disagree, Postgres wins"). Only resets the value if it still
-- matches what we just set — if a *different, legitimately newer* bid has
-- come in in the meantime, this is a no-op, so we never clobber real data
-- while trying to undo a failed one.
--
-- KEYS[1] = auction:{id}:current_bid
-- KEYS[2] = auction:{id}:current_bidder
-- ARGV[1] = the value we're trying to undo (what we just set it to)
-- ARGV[2] = value to restore it to
-- ARGV[3] = bidder to restore it to, or '' if there was no previous bid at all

local actual = redis.call('GET', KEYS[1])
if actual == ARGV[1] then
  if ARGV[3] == '' then
    redis.call('DEL', KEYS[1])
    redis.call('DEL', KEYS[2])
  else
    redis.call('SET', KEYS[1], ARGV[2])
    redis.call('SET', KEYS[2], ARGV[3])
  end
  return 1
end
return 0
