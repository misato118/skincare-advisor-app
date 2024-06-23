import React, { useRef, useState, useEffect } from "react";
//import { SpinButton } from "@fluentui/react";
import { Button, Drawer, Checkbox, TextField, Grid } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
//import readNDJSONStream from "ndjson-readablestream";

import styles from "./Copilot.css";

import {
    chatApi,
    RetrievalMode,
    ChatAppResponse,
    ChatAppResponseOrError,
    ChatAppRequest,
    ResponseMessage,
    VectorFieldOptions,
    GPT4VInput
} from "../api";
import Answer from "./Answer/Answer";
import AnswerError from "./Answer/Answer";
import AnswerLoading from "./Answer/Answer";
import QuestionInput from "./QuestionInput/QuestionInput";
import ExampleList from "./Example/ExampleList";
import UserChatMessage from "./UserChatMessage/UserChatMessage";
//import { ClearChatButton } from "../components/ClearChatButton";
import VectorSettings from "./VectorSettings/VectorSettings";

const Copilot = () => {
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [promptTemplate, setPromptTemplate] = useState("");
    const [retrieveCount, setRetrieveCount] = useState(3);
    const [retrievalMode, setRetrievalMode] = useState({hybrid: "hybrid", vectors: "vectors", text: "text"});
    const [useSemanticRanker, setUseSemanticRanker] = useState(true);
    const [shouldStream, setShouldStream] = useState(true);
    const [useSemanticCaptions, setUseSemanticCaptions] = useState(false);
    const [excludeCategory, setExcludeCategory] = useState("");
    const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState(false);
    const [vectorFieldList, setVectorFieldList] = useState([{embedding: "embedding", imageEmbedding: "imageEmbedding", both: "both"}]);
    const [useOidSecurityFilter, setUseOidSecurityFilter] = useState(false);
    const [useGroupsSecurityFilter, setUseGroupsSecurityFilter] = useState(false);
    const [gpt4vInput, setGPT4VInput] = useState({textAndImages: "textAndImages", images: "", texts: ""});
    const [useGPT4V, setUseGPT4V] = useState(false);

    const lastQuestionRef = useRef("");
    const chatMessageStreamEnd = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState("");

    const [activeCitation, setActiveCitation] = useState("");

    const [selectedAnswer, setSelectedAnswer] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showGPT4VOptions, setShowGPT4VOptions] = useState(false);

    const makeApiRequest = async (question) => {
        console.log("Copilot makeApiRequest");
        lastQuestionRef.current = question;

        error && setError(undefined);
        setIsLoading(true);
        setActiveCitation(undefined);

        try {
            const request = {
                prompt: question,
                session_id: "1234" // TODO: Need to generate a session id
            };

            const response = await chatApi(request);
            console.log(JSON.stringify(response.body));
            const contentType = response.headers.get("content-type");
            if (!response.body) {
                console.log("1")
                throw Error("No response body");
            } else if (contentType?.indexOf('text/html') !== -1 || contentType?.indexOf('text/plain') !== -1) {
                console.log("2")
                const bodyText = await response.text();
                console.error(`Chat Error: ${bodyText}`);
                setError(bodyText);
            } else {
                console.log("3")
                const parsedResponse = await response.json();
                setAnswers([...answers, [question, parsedResponse]]);
            }
        } catch (e) {
            console.error(`Chat Error: ${e}`);
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setActiveCitation(undefined);
        setAnswers([]);
        setIsLoading(false);
        setIsStreaming(false);
    };

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);

    const onPromptTemplateChange = (newValue) => {
        setPromptTemplate(newValue || "");
    };

    const onRetrieveCountChange = (newValue) => {
        setRetrieveCount(parseInt(newValue || "3"));
    };

    const onUseSemanticRankerChange = (checked) => {
        setUseSemanticRanker(!!checked);
    };

    const onUseSemanticCaptionsChange = (checked) => {
    };

    const onShouldStreamChange = (checked) => {
        setShouldStream(!!checked);
    };

    const onExcludeCategoryChanged = (newValue) => {
        setExcludeCategory(newValue || "");
    };

    const onUseSuggestFollowupQuestionsChange = (checked) => {
        setUseSuggestFollowupQuestions(!!checked);
    };

    const onUseOidSecurityFilterChange = (checked) => {
        setUseOidSecurityFilter(!!checked);
    };

    const onUseGroupsSecurityFilterChange = (checked) => {
        setUseGroupsSecurityFilter(!!checked);
    };

    const onExampleClicked = (example) => {
        makeApiRequest(example);
    };

    const onShowCitation = (citation, index) => {
        setActiveCitation(citation);
        setSelectedAnswer(index);
    };

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh' }}>
            <Grid item xs={12}>
                <Button variant="outlined" className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading}>Clear Chat</Button>
            </Grid>
            <Grid item xs={12}>
                {!lastQuestionRef.current ? (
                    <div>
                        <h2>Ask anything or try an example</h2>
                        <ExampleList onExampleClicked={onExampleClicked} useGPT4V={useGPT4V} />
                    </div>
                ) : (
                    <div className={styles.chatMessageStream}>
                        {!isStreaming &&
                               answers.map((answer, index) => (
                                <div key={index}>
                                    <UserChatMessage message={answer[0]} />
                                    <div className={styles.chatMessageGpt}>
                                        <Answer
                                            isStreaming={false}
                                            key={index}
                                            answer={answer[1]}
                                            isSelected={selectedAnswer === index}
                                            onCitationClicked={c => onShowCitation(c, index)}
                                            onThoughtProcessClicked={() => {}} // {() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                            onSupportingContentClicked={() => {}} // {() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                            onFollowupQuestionClicked={q => makeApiRequest(q)}
                                            showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                        />
                                    </div>
                                </div>
                        ))}
                            {isLoading && (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <AnswerLoading />
                                    </div>
                                </>
                            )}
                            {error ? (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <AnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
                                    </div>
                                </>
                            ) : null}
                            <div ref={chatMessageStreamEnd} />
                        </div>
                    )}

                    <Grid item xs={12}>
                        <QuestionInput
                            clearOnSend
                            placeholder="Type a new question (e.g. what is product FR-R92B-58?)"
                            disabled={isLoading}
                            onSend={question => makeApiRequest(question)}
                        />
                    </Grid>
                </Grid>

                <Drawer
                    oepn={isConfigPanelOpen}
                    anchor="right"
                    onClose={() => <Button onClick={() => setIsConfigPanelOpen(false)}>Close</Button>}
                >
                    <TextField
                        className={styles.chatSettingsSeparator}
                        defaultValue={promptTemplate}
                        label="Override prompt template"
                        multiline
                        onChange={onPromptTemplateChange}
                    />

                    <TextField
                        className={styles.chatSettingsSeparator}
                        label="Retrieve this many search results:"
                        min={1}
                        max={50}
                        onChange={onRetrieveCountChange}
                    />
                    <TextField className={styles.chatSettingsSeparator} label="Exclude category" onChange={onExcludeCategoryChanged} />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticRanker}
                        //label="Use semantic ranker for retrieval"
                        onChange={onUseSemanticRankerChange}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticCaptions}
                        //label="Use query-contextual summaries instead of whole documents"
                        onChange={onUseSemanticCaptionsChange}
                        disabled={!useSemanticRanker}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSuggestFollowupQuestions}
                        //label="Suggest follow-up questions"
                        onChange={onUseSuggestFollowupQuestionsChange}
                    />

                    <VectorSettings
                        showImageOptions={useGPT4V && showGPT4VOptions}
                        updateVectorFields={(options) => setVectorFieldList(options)}
                        updateRetrievalMode={(retrievalMode) => setRetrievalMode(retrievalMode)}
                    />

                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={shouldStream}
                        //label="Stream chat completion responses"
                        onChange={onShouldStreamChange}
                    />
                </Drawer>
        </Grid>
    );
};

export default Copilot;
