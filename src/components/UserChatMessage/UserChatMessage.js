import styles from "./UserChatMessage.css";

const UserChatMessage = (props) => {
    return (
        <div className={styles.container}>
            <div className={styles.message}>{props.message}</div>
        </div>
    );
};

export default UserChatMessage;