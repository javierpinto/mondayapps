import { ELEMENT_TYPES, getTestId } from "../../../utils/test-utils";
import cx from "classnames";
import React from "react";
import PropTypes from "prop-types";
import styles from "./SliderFilledTrack.module.scss";

function defineFilledTrackProps({ dimension, offset, reverse }) {
  if (reverse) {
    return {
      right: `${offset}%`,
      width: `${dimension - offset}%`
    };
  }
  return {
    left: `${offset}%`,
    width: `${dimension - offset}%`
  };
}

const SliderFilledTrack = ({ className, dimension, offset, reverse, id, "data-testid": dataTestId }) => {
  const filledTrackStyle = defineFilledTrackProps({ dimension, offset, reverse });
  return (
    <div
      className={cx(styles.sliderFilledTrack, "monday-slider__filled-track", className)}
      style={filledTrackStyle}
      id={id}
      data-testid={dataTestId || getTestId(ELEMENT_TYPES.SLIDER_FILLED_TRACK, id)}
    />
  );
};

SliderFilledTrack.propTypes = {
  /**
   * Consumer/Custom/Extra `class names` to be added to the Component's-Root-Node
   */
  className: PropTypes.string,
  /**
   * Size of filled track, according to selected value of component (Slider)
   */
  dimension: PropTypes.number,
  /**
   * Offset from start of track
   */
  offset: PropTypes.number,
  /**
   * Start Filled Track from the end of the track
   * (`right` for LTR and `left` for RTL, `bottom` for vertical)
   */
  reverse: PropTypes.bool
};

SliderFilledTrack.defaultProps = {
  className: "",
  dimension: 0,
  offset: 0,
  reverse: false
};

export default SliderFilledTrack;
