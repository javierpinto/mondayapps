import NOOP from "lodash/noop";
import React, { useMemo, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { CSSTransition } from "react-transition-group";
import Button from "../Button/Button";
import ToastLink from "./ToastLink/ToastLink";
import ToastButton from "./ToastButton/ToastButton";
import Icon from "../Icon/Icon";
import Check from "../Icon/Icons/components/Check";
import Alert from "../Icon/Icons/components/Alert";
import Info from "../Icon/Icons/components/Info";
import CloseSmall from "../Icon/Icons/components/CloseSmall";
import { TOAST_TYPES, TOAST_ACTION_TYPES } from "./ToastConstants";
import "./Toast.scss";
import { useA11yNotification } from "../../hooks/useA11yNotification";

const defaultIconMap = {
  [TOAST_TYPES.NORMAL]: Info,
  [TOAST_TYPES.POSITIVE]: Check,
  [TOAST_TYPES.NEGATIVE]: Alert
};

const getIcon = (type, icon) => {
  /* icon may be node a may be a string */
  if (icon && typeof icon === "object") {
    return icon;
  }
  return icon || defaultIconMap[type] ? (
    <Icon
      iconType={icon ? Icon.type.ICON_FONT : Icon.type.SVG}
      clickable={false}
      icon={icon || defaultIconMap[type]}
      iconSize="24px"
      ignoreFocusStyle
    />
  ) : null;
};

const Toast = ({
  open,
  autoHideDuration,
  type,
  icon,
  hideIcon,
  action: deprecatedAction,
  actions,
  children,
  closeable,
  onClose,
  className,
  ariaLiveHandledOutside
}) => {
  const ref = useRef(null);
  const toastLinks = useMemo(() => {
    return actions
      ? actions
          .filter(action => action.type === TOAST_ACTION_TYPES.LINK)
          .map(({ type: _type, ...otherProps }) => <ToastLink {...otherProps} />)
      : null;
  }, [actions]);
  const toastButtons = useMemo(() => {
    return actions
      ? actions
          .filter(action => action.type === TOAST_ACTION_TYPES.BUTTON)
          .map(({ type: _type, content, ...otherProps }) => <ToastButton {...otherProps}> {content} </ToastButton>)
      : null;
  }, [actions]);
  const classNames = useMemo(() => cx("monday-style-toast", `monday-style-toast--type-${type}`, className), [
    type,
    className
  ]);
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);
  /* Timer */
  const timerAutoHide = useRef();
  const setAutoHideTimer = useCallback(
    duration => {
      if (!onClose || duration == null) {
        return;
      }

      clearTimeout(timerAutoHide.current);
      timerAutoHide.current = setTimeout(() => {
        handleClose(null, "timeout");
      }, duration);
    },
    [handleClose, onClose]
  );
  React.useEffect(() => {
    if (open && autoHideDuration > 0) {
      setAutoHideTimer(autoHideDuration);
    }

    return () => {
      clearTimeout(timerAutoHide.current);
    };
  }, [open, autoHideDuration, setAutoHideTimer]);
  const iconElement = !hideIcon && getIcon(type, icon);
  const a11yProps = useA11yNotification({
    isUrgent: type === Toast.types.NEGATIVE,
    isAriaLiveHandledOutside: ariaLiveHandledOutside,
    ref,
    isIncludeActions: (actions && actions.length > 0) || !!deprecatedAction
  });

  return (
    <CSSTransition in={open} classNames="monday-style-toast-animation" timeout={400} unmountOnExit>
      <div className={classNames} {...a11yProps}>
        {iconElement && <div className="monday-style-toast-icon">{iconElement}</div>}
        <div
          className={cx("monday-style-toast-content", {
            "monday-style-toast-content-no-icon": !iconElement
          })}
        >
          {children}
          {toastLinks}
        </div>
        {(toastButtons || deprecatedAction) && (
          <div className="monday-style-toast-action">{toastButtons || deprecatedAction}</div>
        )}
        {closeable && (
          <Button
            className="monday-style-toast_close-button"
            onClick={handleClose}
            size={Button.sizes.SMALL}
            kind={Button.kinds.TERTIARY}
            color={Button.colors.ON_PRIMARY_COLOR}
            ariaLabel="close-toast"
          >
            <Icon iconType={Icon.type.SVG} clickable={false} icon={CloseSmall} iconSize="20px" ignoreFocusStyle />
          </Button>
        )}
      </div>
    </CSSTransition>
  );
};

Toast.types = TOAST_TYPES;
Toast.actionTypes = TOAST_ACTION_TYPES;

Toast.propTypes = {
  /** If true, Toast is open (visible) */
  className: PropTypes.string,
  actions: PropTypes.array,
  open: PropTypes.bool,
  type: PropTypes.oneOf([TOAST_TYPES.NORMAL, TOAST_TYPES.POSITIVE, TOAST_TYPES.NEGATIVE]),
  /** Possible to override the dafult icon */
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /** If true, won't show the icon */
  hideIcon: PropTypes.bool,
  /** The action to display */
  action: PropTypes.element,
  /** If false, won't show the close button */
  closeable: PropTypes.bool,
  onClose: PropTypes.func,
  /** The number of milliseconds to wait before
   * automatically closing the Toast
   * (0 or null cancels this behaviour) */
  autoHideDuration: PropTypes.number,
  /**
   * Is the app contains separate region for aria live messages (screen reader) or should we treat the toast as region
   */
  ariaLiveHandledOutside: PropTypes.bool
};

Toast.defaultProps = {
  ariaLiveHandledOutside: false,
  type: TOAST_TYPES.NORMAL,
  className: "",
  open: false,
  action: null,
  hideIcon: false,
  icon: null,
  closeable: true,
  autoHideDuration: null,
  actions: undefined,
  onClose: NOOP
};

export default Toast;
