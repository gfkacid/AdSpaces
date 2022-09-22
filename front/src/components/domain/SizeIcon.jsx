/* eslint-disable jsx-a11y/alt-text */

export default function SizeIcon({ size }) {
  const sizeDimensions = {
    wide: '728 x 90',
    square: '200 x 200',
    skyscraper: '160 x 600'
  }
  return (
    <span className={"size-box size-box-" + size} alt={size} title={size+' - '+ sizeDimensions[size]}></span>
  );
}
