import styles from "./Button.module.css";
export default function Button({ children, onClick, type }: any) {
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </button>
  );
}
