import cx from "classnames";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import useMergeRefs from "../../hooks/useMergeRefs";
import Icon from "../Icon/Icon";
import Heading from "../Heading/Heading";
import DropdownChevronDown from "../Icon/Icons/components/DropdownChevronDown";
import { ELEMENT_TYPES, getTestId } from "../../utils/test-utils";
import styles from "./ExpandCollapse.module.scss";

const ExpandCollapse = forwardRef(
  (
    {
      children,
      headerComponentRenderer,
      title,
      className,
      defaultOpenState,
      iconSize,
      id,
      open,
      onClick,
      "data-testid": dataTestId
    },
    ref
  ) => {
    const componentRef = useRef(null);
    const mergedRef = useMergeRefs({ refs: [ref, componentRef] });

    const [isOpen, setIsOpen] = useState(defaultOpenState);
    const isExpanded = open === undefined ? isOpen : open;

    const toggleExpand = () => {
      setIsOpen(!isOpen);
    };
    const renderHeader = useCallback(() => {
      return (
        <Heading
          type={Heading.types.h5}
          value={title}
          className={cx(styles.headerContent, "expand-collapse__header-content")}
        />
      );
    }, [title]);

    return (
      <div
        ref={mergedRef}
        className={cx(styles.wrapper, "expand-collapse--wrapper", className)}
        id={id}
        data-testid={dataTestId || getTestId(ELEMENT_TYPES.EXPAND_COLLAPSE, id)}
      >
        <div className={cx(styles.expandCollapse, "expand-collapse")}>
          <button
            type="button"
            className={cx(styles.header, "expand-collapse__header", styles.section, "expand-collapse__section", {
              [styles.headerOpen]: isExpanded,
              ["expand-collapse__header--open"]: isExpanded
            })}
            onClickCapture={onClick || toggleExpand}
            aria-expanded={isExpanded}
            aria-controls={`${id}-controls`}
          >
            {title.length !== 0 ? renderHeader() : headerComponentRenderer && headerComponentRenderer()}
            <Icon
              className={
                isExpanded
                  ? cx(styles.animateIconOpen, "animate-icon-open")
                  : cx(styles.animateIconClose, "animate-icon-close")
              }
              iconType={Icon.type.SVG}
              icon={DropdownChevronDown}
              iconSize={iconSize}
              clickable={false}
            />
          </button>
          {isExpanded && (
            <div
              className={cx(styles.content, "expand-collapse__content", styles.section, "expand-collapse__section")}
              id={`${id}-controls`}
              role="region"
            >
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ExpandCollapse.propTypes = {
  /**
   * Id for the component
   */
  id: PropTypes.string,
  /**
   * Component as parameter to be rendered as header
   */
  headerComponentRenderer: PropTypes.func,
  /**
   * Header title
   */
  title: PropTypes.string,
  /**
   * The value of the expandable section
   */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  /**
   * Custom styling
   */
  className: PropTypes.string,
  /**
   * The expand icon font size
   */
  iconSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Should be open or closed by default (when rendered)
   */
  defaultOpenState: PropTypes.bool,
  open: PropTypes.bool,
  onClick: PropTypes.func
};

ExpandCollapse.defaultProps = {
  id: "",
  className: "",
  defaultOpenState: false,
  iconSize: 24,
  onClick: null,
  title: "",
  headerComponentRenderer: null,
  children: null,
  open: undefined
};

export default ExpandCollapse;
