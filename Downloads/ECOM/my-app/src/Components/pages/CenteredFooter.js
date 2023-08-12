import React from "react";
import PropTypes from "prop-types";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import GitHubIcon from "@mui/icons-material/GitHub";
import MKBox from "Components/MKBox";
import MKTypography from "Components/MKTypography";

function CenteredFooter({ company, links, socials, light }) {
  const { href, name } = company;

  const year = new Date().getFullYear();

  const renderLinks = links.map((link) => (
    <MKTypography
      key={link.name}
      component={Link}
      href={link.href}
      variant="body2"
      color={light ? "white" : "secondary"}
      fontWeight="regular"
      sx={{
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
      }}
    >
      {link.name}
    </MKTypography>
  ));

  const renderSocials = socials.map((social) => (
    <MKTypography
      key={social.link}
      component={Link}
      href={social.link}
      variant="body2"
      color={light ? "white" : "secondary"}
      fontWeight="regular"
      sx={{
        textDecoration: "none",
        "&:hover": {
          color: "#c4c4c4",
        },
      }}
    >
      {social.icon}
    </MKTypography>
  ));

  return (
    <MKBox component="footer" py={6} bgcolor={light ? "#212121" : "#f4f4f4"}>
      <Grid container justifyContent="center">
        <Grid item xs={10} lg={8}>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            spacing={{ xs: 2, lg: 3, xl: 6 }}
            mb={3}
          >
            {renderLinks}
          </Stack>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Stack display="flex" direction="row" justifyContent="center" spacing={3} mt={1} mb={3}>
            {renderSocials}
          </Stack>
        </Grid>
        <Grid item xs={12} lg={8} sx={{ textAlign: "center" }}>
          <MKTypography variant="body2" color={light ? "white" : "secondary"}>
            &copy; {year} {name}. All rights reserved.
          </MKTypography>
        </Grid>
      </Grid>
    </MKBox>
  );
}

CenteredFooter.defaultProps = {
  company: { href: "https://www.creative-tim.com/", name: "Creative Tim" },
  links: [
    { href: "https://www.creative-tim.com/", name: "Company" },
    { href: "https://www.creative-tim.com/presentation", name: "About Us" },
    { href: "https://www.creative-tim.com/presentation", name: "Team" },
    { href: "https://www.creative-tim.com/license", name: "License" },
  ],
  socials: [
    {
      icon: <TwitterIcon fontSize="small" />,
      link: "https://twitter.com/Ahmedz14z",
    },
    {
      icon: <InstagramIcon fontSize="small" />,
      link: "https://github.com/Ahmed14z",
    },
    { icon: <GitHubIcon fontSize="small" />, link: "https://github.com/Ahmed14z" },
  ],
  light: false,
};

CenteredFooter.propTypes = {
  company: PropTypes.objectOf(PropTypes.string),
  links: PropTypes.arrayOf(PropTypes.object),
  socials: PropTypes.arrayOf(PropTypes.object),
  light: PropTypes.bool,
};

export default CenteredFooter;
