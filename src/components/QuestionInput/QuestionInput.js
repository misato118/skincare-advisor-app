import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";

import { Grid, TextField, Button, Tooltip } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

import styles from "./QuestionInput.css";

const QuestionInput = (props) => {
    const [question, setQuestion] = useState("");

    useEffect(() => {
        props.initQuestion && setQuestion(props.initQuestion);
    }, [props.initQuestion]);

    const sendQuestion = () => {
        if (props.disabled || !question.trim()) {
            return;
        }

        props.onSend(question);

        if (props.clearOnSend) {
            setQuestion("");
        }
    };

    const onEnterPress = (ev) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    const onQuestionChange = (newValue) => {
        /*
        if (!newValue) {
            console.log("empty");
            setQuestion("");
        } else if (newValue.length <= 1000) {
            console.log("add");
            setQuestion(newValue);
        }
        */
        const input = newValue["nativeEvent"].data
        if (!input) {
            setQuestion(question.slice(0, question.length - 1));
        } else if (question.length <= 1000) {
            setQuestion(question + input);
        }
    };

    const { instance } = useMsal();
    const disableRequiredAccessControl = false; //requireAccessControl && !isLoggedIn(instance);
    const sendQuestionDisabled = props.disabled || !question.trim() || disableRequiredAccessControl;

    if (disableRequiredAccessControl) {
        props.placeholder = "Please login to continue...";
    }

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="center">
            <Grid item xs={10}>
                <TextField
                    className={styles.questionInputTextArea}
                    disabled={disableRequiredAccessControl}
                    placeholder={props.placeholder}
                    multiline
                    fullWidth
                    value={question}
                    onChange={onQuestionChange}
                    onKeyDown={onEnterPress}
                />
            </Grid>
            <Grid item xs={2}>
                <Tooltip title="Ask question button">
                    <Button size="large" startIcon={<SendIcon />} onClick={sendQuestion} disabled={sendQuestionDisabled} />
                </Tooltip>
            </Grid>
        </Grid>
    );
};

export default QuestionInput;