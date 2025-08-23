import { SketchPicker } from 'react-color';

const ColorPicker = ({
  color,
  changeColor,
}) => {
  return (
    <SketchPicker
      styles={{
        default: {
          picker: {
            background: '#111',
          },
        },
      }}
      color={color}
      disableAlpha
      onChange={(color) => {
        changeColor(color.rgb);
      }}
    />
  );
};

export default ColorPicker;