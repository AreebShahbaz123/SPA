import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  ...rest
}) {
  return (
    <button className={`btn btn--${variant} btn--${size}`} {...rest}>
      {children}
    </button>
  );
}