import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-static";

export const alt = "AUTOM8ED | Web Development & AI Solutions";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: "black",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontFamily: "sans-serif",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background:
                            "radial-gradient(circle at 50% 50%, #2a2a2a 0%, #000 100%)",
                        zIndex: -1,
                    }}
                />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", background: "linear-gradient(to bottom right, #fff, #888)", backgroundClip: "text", color: "transparent", marginBottom: 20 }}>
                        AUTOM8ED
                    </span>
                    <span style={{ fontSize: 48, opacity: 0.8, textAlign: "center", maxWidth: "80%" }}>
                        Premium Web Development & AI Solutions
                    </span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
