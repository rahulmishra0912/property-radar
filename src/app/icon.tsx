import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f5ef",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
          <path
            d="M18 48 A30 30 0 1 1 62 18"
            stroke="#7A8B96"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <path
            d="M24 46 A22 22 0 1 1 58 22"
            stroke="#7A8B96"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <path
            d="M22 46 L40 26 L58 46 V64 H22 Z"
            stroke="#8FA083"
            strokeWidth="4.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M32 56 L40 44 L48 56"
            stroke="#8FA083"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
