import { useMemo } from "react";
import { Stack, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DOMPurify from "dompurify";

import styles from "./Answer.css";

import { ChatAppResponse, getCitationFilePath } from "../../api";
import { parseAnswerToHtml } from "./AnswerParser";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

//const Answer = (answer, isSelected, isStreaming, onCitationClicked, onThoughtProcessClicked, onSupportingContentClicked, onFollowupQuestionClicked, showFollowupQuestions) => {
const Answer = (props) => {
    console.log("TEST " + JSON.stringify(props));
    const messageContent = props.answer.message; //answer.choices[0].message.content;
    const parsedAnswer = useMemo(() => parseAnswerToHtml(messageContent, props.isStreaming, props.onCitationClicked), [props.answer]);

    const sanitizedAnswerHtml = DOMPurify.sanitize(parsedAnswer.answerHtml).replace(/```json/g, "<pre>").replace(/```/g, "</pre>");

    return (
        <Stack className={`${styles.answerContainer} ${props.isSelected && styles.selected}`} spacing={2}>
            <Item>
                <Stack direction="row" spacing={2}>
                    <AutoAwesomeIcon />
                    <div>
                    </div>
                </Stack>
            </Item>

            <Item>
                <div className={styles.answerText} dangerouslySetInnerHTML={{ __html: sanitizedAnswerHtml }}></div>
            </Item>

            {!!parsedAnswer.citations.length && (
                <Item>
                    <Stack direction="row" flexWrap="wrap">
                        <span className={styles.citationLearnMore}>Citations:</span>
                        {parsedAnswer.citations.map((x, i) => {
                            const path = getCitationFilePath(x);
                            return (
                                <a key={i} className={styles.citation} title={x} onClick={() => props.onCitationClicked(path)}>
                                    {`${++i}. ${x}`}
                                </a>
                            );
                        })}
                    </Stack>
                </Item>
            )}
        </Stack>
    );
};

export default Answer;