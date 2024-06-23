import React from "react";
import styles from "./Example.css";

export const Example = (props) => {
    return (
        <div className={styles.example} onClick={() => props.onClick(props.value)}>
            <p className={styles.exampleText}>{props.text}</p>
        </div>
    );
};
