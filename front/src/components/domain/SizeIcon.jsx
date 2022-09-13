/* eslint-disable jsx-a11y/alt-text */

export default function SizeIcon({ size }) {
  return (
    <span className={"size-box size-box-" + size} alt={size}></span>
  );
}
