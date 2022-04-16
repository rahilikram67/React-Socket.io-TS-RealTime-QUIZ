import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Avatar, Stack } from '@mui/material';

export default function QuestionAsker({ question, answers, hookChoosen, setChoosen, imgs }: Question & { setChoosen: Function, hookChoosen: string }) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChoosen((event.target as HTMLInputElement).value);
    };

    return (
        <FormControl>
            <FormLabel>{question}</FormLabel>
            <Stack flexDirection="row" marginTop={1} justifyContent="space-between" width="200%" maxWidth={290} marginLeft={-1} flexWrap="wrap">
                {
                    imgs ? imgs.map((img, index) => <Avatar onClick={() => window.open(img, "_blank")} key={index} variant='square' src={img} style={{
                        height: 56,
                        width: 56,
                        margin: "auto",
                        marginTop: "3px",
                        cursor: "pointer"
                    }} alt="" />) : null
                }

            </Stack>
            <RadioGroup
                name="controlled-radio-buttons-group"
                value={hookChoosen}
                onChange={handleChange}
            >
                {
                    answers.map((answer, index) => <FormControlLabel key={index} value={answer} control={<Radio />} label={answer} />)
                }
            </RadioGroup>
        </FormControl>
    );
}