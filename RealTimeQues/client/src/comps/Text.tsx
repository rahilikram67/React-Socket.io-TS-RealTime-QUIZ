import { Typography } from "@mui/material";

export function Text({ fontSize, text }: { fontSize: string; text: string; }) {
    return <Typography style={{ fontSize: fontSize, display: "block", textAlign: "center" }}>
        {text}
    </Typography>;
}
