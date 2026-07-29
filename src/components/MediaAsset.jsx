import React from "react";
import { isVideoMediaUrl } from "../utils/mediaUrl";

/**
 * Renders Cloudinary/Fire/public URL as img or autoplay-muted video loop for cards.
 */
export default function MediaAsset({
  src,
  alt,
  className,
  videoProps,
  imgProps,
  /** When false (default): muted loop autoplay for cards. When true: show controls for detail/modals. */
  videoControls,
  ...rest
}) {
  if (!src) return null;

  if (isVideoMediaUrl(src)) {
    const v = videoProps || {};
    const withControls =
      typeof videoControls === "boolean"
        ? videoControls
        : Boolean(v.controls);
    return (
      <video
        src={src}
        className={className}
        playsInline
        muted={withControls ? v.muted : true}
        autoPlay={!withControls}
        loop={!withControls || Boolean(v.loop)}
        controls={withControls}
        {...v}
        {...rest}
      />
    );
  }

  const i = imgProps || {};
  return (
    <img src={src} alt={alt || ""} className={className} {...i} {...rest} />
  );
}
