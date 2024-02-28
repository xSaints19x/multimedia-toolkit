import React, { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DownloadIcon from '@mui/icons-material/Download';

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

interface Option {
  format: string;
  icon: React.ReactNode;
}

interface CustomizedMenusProps {
  options: Option[];
  output: any;
  handleSave: (format: string) => void;
}

export default function CustomizedMenus({
  options,
  output,
  handleSave,
}: CustomizedMenusProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (format: string) => {
    handleClose();
    handleSave(format);
  };

  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    if (output) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [output]);

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disabled={isDisabled}
        disableElevation
        onClick={handleClick}
        startIcon={<DownloadIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        size="large"
      >
        Save as
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem
            key={option.format}
            onClick={() => handleMenuItemClick(option.format)}
            disableRipple
          >
            {option.icon}
            {option.format}
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}
