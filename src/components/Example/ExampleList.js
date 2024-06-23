import React from "react";
import { Example } from "./Example";
import styles from "./Example.css";

const DEFAULT_EXAMPLES = [
    "What is the price of the product with sku `FR-R92B-58`?",
    "What is the most popular products?",
    "What is Innisfree Eyebrow?"
];

const GPT4V_EXAMPLES = [
    "Compare the impact of interest rates and GDP in financial markets.",
    "What is the expected trend for the S&P 500 index over the next five years? Compare it to the past S&P 500 performance",
    "Can you identify any correlation between oil prices and stock market trends?"
];


const ExampleList = (props) => {
    return (
        <ul className={styles.examplesNavList}>
            {(props.useGPT4V ? GPT4V_EXAMPLES : DEFAULT_EXAMPLES).map((question, i) => (
                <li key={i}>
                    <Example text={question} value={question} onClick={props.onExampleClicked} />
                </li>
            ))}
        </ul>
    );
};

export default ExampleList;
