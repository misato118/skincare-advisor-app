import { useEffect, useState } from "react";
import styles from "./VectorSettings.css";
//import { RetrievalMode, VectorFieldOptions } from "../../api";
import { FormControl, FormLabel, RadioGroup, Radio, Stack, FormControlLabel } from "@mui/material";

const vectorFields = [
    {
        key: "embedding",
        text: "Text Embeddings"
    },
    {
        key: "imageEmbedding",
        text: "Image Embeddings"
    },
    {
        key: "both",
        text: "Text and Image embeddings"
    }
];

const VectorSettings = (updateRetrievalMode, updateVectorFields, showImageOptions) => {
    const [retrievalMode, setRetrievalMode] = useState();
    const [vectorFieldOption, setVectorFieldOption] = useState("");

    const onVectorFieldsChange = (option) => {
        option && setVectorFieldOption(option.key);
        let list;
        if (option?.key === "both") {
            list = ["embedding", "imageEmbedding"];
        } else {
            list = [option?.key];
        }
        updateVectorFields(list);
    };

    useEffect(() => {
        showImageOptions
            ? updateVectorFields(["embedding", "imageEmbedding"])
            : updateVectorFields(["embedding"]);
    }, [showImageOptions]);

    return (
        <Stack className={styles.container}>
            {showImageOptions && ["vectors", "hybrid"].includes(retrievalMode) && (
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Vector Fields (Multi-query vector search)</FormLabel>
                    <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="Text Embeddings" onChange={onVectorFieldsChange}>
                        <FormControlLabel value="Text Embeddings" control={<Radio />} label="Text Embeddings" />
                        <FormControlLabel value="Image Embeddings" control={<Radio />} label="Image Embeddings" />
                        <FormControlLabel value="Text and Image embeddings" control={<Radio />} label="Text and Image embeddings" />
                    </RadioGroup>
                </FormControl>
            )}
        </Stack>
    );
};

export default VectorSettings;