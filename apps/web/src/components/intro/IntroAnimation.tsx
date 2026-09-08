import { useEffect, useState } from "react";

type IntroAnimationProps = {
  onComplete: () => void;
};

const reelImages = [
  "lot-01.webp",
  "lot-02.webp",
  "lot-03.webp",
  "lot-04.webp",
  "lot-05.webp",
  "lot-06.webp",
  "lot-07.webp",
  "lot-09.webp",
];

const lots = Array.from(
  { length: 30 },
  (_, index) => ({
    id: index + 1,
    image:
      reelImages[index % reelImages.length],
  }),
);

function IntroAnimation({
  onComplete,
}: IntroAnimationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();

    let frameId: number | undefined;
    let completionTimeout:
      | ReturnType<typeof setTimeout>
      | undefined;

    const animate = (now: number) => {
      const elapsed = now - start;

      // 2-second intro
      const value = Math.min(
        elapsed / 2000,
        1,
      );

      setProgress(value);

      if (value < 1) {
        frameId =
          requestAnimationFrame(animate);
        return;
      }

      completionTimeout = setTimeout(() => {
        onComplete();
      }, 80);
    };

    frameId =
      requestAnimationFrame(animate);

    return () => {
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId);
      }

      if (completionTimeout !== undefined) {
        clearTimeout(completionTimeout);
      }
    };
  }, [onComplete]);

  const grayscale =
    100 - progress * 100;

  const saturation =
    0.3 + progress * 1.2;

  const brightness =
    0.82 + progress * 0.18;

  const contrast =
    0.96 + progress * 0.14;

  const reelSpeed = Math.max(
    0.38,
    1.8 - progress * 1.42,
  );

  const gavelRotation =
    Math.pow(progress, 2.5) * 720;

  return (
    <main className="intro">

      {/* BACKGROUND REEL */}
      <div
        className="auction-reel"
        style={{
          filter: `
            grayscale(${grayscale}%)
            saturate(${saturation})
            brightness(${brightness})
            contrast(${contrast})
          `,
          animationDuration:
            `${reelSpeed}s`,
        }}
      >
        {lots.map((lot) => (
          <div
            className="auction-image"
            key={lot.id}
          >
            <img
              src={`/intro/${lot.image}`}
              alt=""
              aria-hidden="true"
              draggable={false}
            />

            <div className="photo-overlay" />

            <div
              className="gloss"
              style={{
                opacity:
                  progress > 0.35
                    ? (progress - 0.35) *
                      0.75
                    : 0,
              }}
            />
          </div>
        ))}
      </div>

      {/* BLACK CAMERA-LENS SHEET */}
      <div className="lens-black" />

      {/* EXISTING BACKGROUND EFFECTS */}
      <div className="cream-wash" />

      <div className="purple-wash" />

      <div className="purple-streak streak-one" />

      <div className="purple-streak streak-two" />

      {/* BRAND */}
      <div className="brand">
        <div className="brand-name">
          ONBID
        </div>

        <div className="brand-tagline">
          <span />
          BID CHALU HAI
        </div>
      </div>

      {/* CLOCK */}
      <div className="clock-section">

        <div
          className="clock-glow"
          style={{
            opacity:
              0.35 + progress * 0.65,
          }}
        />

        <div
          className="auction-clock"
          style={{
            transform:
              `scale(${
                0.9 + progress * 0.04
              })`,
          }}
        >
          <div className="clock-face">

            <div className="clock-brand">
              ONBID
            </div>

            <div className="clock-caption">
              AUCTION HOUSE
            </div>

            {[...Array(60)].map(
              (_, index) => (
                <span
                  key={index}
                  className={
                    index % 5 === 0
                      ? "clock-tick major"
                      : "clock-tick"
                  }
                  style={{
                    transform:
                      `rotate(${
                        index * 6
                      }deg)`,
                  }}
                />
              ),
            )}

            <span className="roman r12">
              XII
            </span>

            <span className="roman r3">
              III
            </span>

            <span className="roman r6">
              VI
            </span>

            <span className="roman r9">
              IX
            </span>

            <div className="small-dial left">
              <span />
            </div>

            <div className="small-dial right">
              <span />
            </div>

            <div
              className="gavel-hand"
              style={{
                transform:
                  `rotate(${
                    gavelRotation
                  }deg)`,
              }}
            >
              <div className="gavel-stick" />

              <div className="gavel-head">
                <span />
              </div>
            </div>

            <div className="clock-center">
              <span />
            </div>

          </div>
        </div>

        <div className="live-caption">
          <span />

          {progress > 0.9
            ? "12 : 00"
            : "LIVE AUCTION"}

          <span />
        </div>

      </div>
    </main>
  );
}

export default IntroAnimation;