import { FC } from "react";
import { useSelector } from "../../../../store/Store";
import Link from "next/link";
import { styled } from "@mui/material";
import { AppState } from "../../../../store/Store";
import Image from "next/image";

const Logo = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "40px" : "180px",
    overflow: "hidden",
    display: "block",
  }));

  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled href="/">
        {customizer.activeMode === "dark" ? (
          <Image
            src="/images/logos/light-logo.svg"
            alt="logo"
            height={customizer.TopbarHeight}
            width={174}
            priority
          />
        ) : (
          <Image
            src="/images/logos/light-logo.svg"
            alt="logo"
            priority
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', maxWidth: '160px', marginLeft:'7px', height: 'auto', paddingTop: '22px'}} 
          />
        )}
      </LinkStyled>
    );
  }

  return (
    <LinkStyled href="/">
      {customizer.activeMode === "dark" ? (
        <Image
          src="/images/logos/dark-rtl-logo.svg"
          alt="logo"
          height={customizer.TopbarHeight}
          width={174}
          priority
        />
      ) : (
        <Image
          src="/images/logos/light-logo-rtl.svg"
          alt="logo"
          height={customizer.TopbarHeight}
          width={174}
          priority
        />
      )}
    </LinkStyled>
  );
};

export default Logo;
