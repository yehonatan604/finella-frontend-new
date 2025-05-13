import { useState, MouseEvent } from "react";
import { Box, Drawer, IconButton, Menu, MenuItem } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useNavigate } from "react-router-dom";
import BalanceIcon from "@mui/icons-material/Balance";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ApartmentIcon from "@mui/icons-material/Apartment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CalculateIcon from "@mui/icons-material/Calculate";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import AttractionsIcon from "@mui/icons-material/Attractions";
import ConstructionIcon from "@mui/icons-material/Construction";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import { useDispatch, useSelector } from "react-redux";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ChecklistIcon from "@mui/icons-material/Checklist";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../../Auth/hooks/useAuth";
import { TRootState } from "../../../Core/store/store";
import { themeActions } from "../../../Core/store/themeSlice";
import CenterBox from "../styled/CenterBox";
import ColBox from "../styled/ColBox";
import MenuAccordion from "../MenuAccordion";
import { MenuItemWithIcon } from "../MenuItemWithIcon";
import ToolDragDialog from "../dialogs/ToolDragDialog";
import MenuIcon from "@mui/icons-material/Menu";
import useNote from "../../../Notes/hooks/useNote";

const LeftNavigation = () => {
  const [toolModals, setToolModals] = useState({
    calculator: false,
    currency: false,
    timer: false,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, setTheme } = useTheme();
  const { logout } = useAuth();
  const { fetchedNotes } = useNote();
  const isLeftNavOpen = useSelector(
    (state: TRootState) => state.themeSlice.isLeftNavOpen
  );
  const dispatch = useDispatch();
  const unreadNotes =
    fetchedNotes?.filter((n) => n.noteStatus !== "READ" && n.status !== "inactive")
      .length || 0;
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const nav = useNavigate();

  const handleToolClick = (tool: keyof typeof toolModals) => {
    setToolModals((prev) => ({ ...prev, [tool]: !prev[tool] }));
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const gradientBackground =
    mode === "dark"
      ? "linear-gradient(180deg, #1e293b 0%, #334155 100%)"
      : "linear-gradient(180deg, #0d47a1 0%, #1976d2 100%)";

  const iconColor = "#ccc";
  const sectionColor = "#bbb";

  return (
    <>
      <IconButton
        onClick={() => dispatch(themeActions.toggleLeftNav())}
        sx={{
          position: "fixed",
          bottom: 16,
          left: {
            xs: isLeftNavOpen ? "50vw" : 0,
            md: isLeftNavOpen ? "15vw" : 0,
          },
          zIndex: 1300,
          color: mode === "dark" ? "white" : "black",
          transition: "left 0.5s ease-in-out",
          "&:hover": {
            backgroundColor: mode === "dark" ? "#1e293b" : "#1976d2",
          },
        }}
      >
        {isLeftNavOpen ? (
          <KeyboardDoubleArrowLeftIcon />
        ) : (
          <KeyboardDoubleArrowRightIcon />
        )}
      </IconButton>
      <Drawer variant="permanent" open>
        <Box
          sx={{
            width: isLeftNavOpen ? { xs: "50vw", md: "15vw" } : 0,
            transition: "width 0.5s ease-in-out",
            overflowX: "hidden",
          }}
        >
          <ColBox
            sx={{
              width: "100%",
              minHeight: "100vh",
              background: gradientBackground,
              transition: "opacity 0.4s ease",
              opacity: isLeftNavOpen ? 1 : 0,
            }}
          >
            <CenterBox
              sx={{
                height: "7vh",
                backgroundColor: "transparent",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                color: "white",
                width: "inherit",
              }}
            >
              <IconButton sx={{ color: "white" }} onClick={() => nav("/")}>
                <HomeIcon />
              </IconButton>
              <IconButton sx={{ color: "white" }} onClick={handleClick}>
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Link to={"/profile"}>Profile</Link>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to={"/about"}>About</Link>
                </MenuItem>
              </Menu>

              <IconButton onClick={() => setTheme(mode === "dark" ? "light" : "dark")}>
                {mode === "dark" ? (
                  <LightModeRoundedIcon sx={{ color: "white" }} />
                ) : (
                  <DarkModeRoundedIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </CenterBox>

            <Box
              sx={{
                pb: 2,
                mx: "auto",
                width: "inherit",
                overflowY: "auto",
                overflowX: "hidden",
                transition: "opacity 0.4s ease",
                opacity: isLeftNavOpen ? 1 : 0,
              }}
            >
              <MenuAccordion
                title="Records"
                icon={<AttractionsIcon sx={{ color: sectionColor }} />}
              >
                <Link to={"/records/balance-entries"}>
                  <MenuItemWithIcon
                    title="Balance Entries"
                    icon={<BalanceIcon sx={{ color: iconColor }} />}
                  />
                </Link>
                <Link to={"/records/salaries"}>
                  <MenuItemWithIcon
                    title="Salaries"
                    icon={<LocalAtmIcon sx={{ color: iconColor }} />}
                  />
                </Link>
                <Link to={"/records/workplaces"}>
                  <MenuItemWithIcon
                    title="Workplaces"
                    icon={<ApartmentIcon sx={{ color: iconColor }} />}
                  />
                </Link>
              </MenuAccordion>

              <MenuAccordion
                title="Notes"
                icon={<EventNoteIcon sx={{ color: sectionColor }} />}
                badgeValue={unreadNotes > 0 ? unreadNotes : undefined}
              >
                <Link to={"/notes"}>
                  <MenuItemWithIcon
                    title="All Notes"
                    icon={<EditNoteIcon sx={{ color: iconColor }} />}
                  />
                </Link>
                <Link to={"/notes/note-automations"}>
                  <MenuItemWithIcon
                    title="Note Automations"
                    icon={<MarkEmailReadIcon sx={{ color: iconColor }} />}
                  />
                </Link>
                <Link to={"/notes/board"}>
                  <MenuItemWithIcon
                    title="Notes Board"
                    icon={<DashboardCustomizeIcon sx={{ color: iconColor }} />}
                  />
                </Link>
              </MenuAccordion>

              <MenuAccordion
                title="Todo's"
                icon={<ChecklistIcon sx={{ color: sectionColor }} />}
              >
                <Link to={"/todos"}>
                  <MenuItemWithIcon
                    title="All Todo's"
                    icon={<EditNoteIcon sx={{ color: iconColor }} />}
                  />
                </Link>
                <Link to={"/todos/board"}>
                  <MenuItemWithIcon
                    title="Todos Board"
                    icon={<DashboardCustomizeIcon sx={{ color: iconColor }} />}
                  />
                </Link>
              </MenuAccordion>

              <MenuAccordion
                title="Tools"
                icon={<ConstructionIcon sx={{ color: sectionColor }} />}
              >
                <Box onClick={() => handleToolClick("calculator")}>
                  <MenuItemWithIcon
                    title="Calculator"
                    icon={<CalculateIcon sx={{ color: iconColor }} />}
                  />
                </Box>
                <Box onClick={() => handleToolClick("currency")}>
                  <MenuItemWithIcon
                    title="Currency Converter"
                    icon={<CurrencyExchangeIcon sx={{ color: iconColor }} />}
                  />
                </Box>
                <Box onClick={() => handleToolClick("timer")}>
                  <MenuItemWithIcon
                    title="Timer"
                    icon={<TimerSharpIcon sx={{ color: iconColor }} />}
                  />
                </Box>
              </MenuAccordion>
            </Box>
          </ColBox>

          <ToolDragDialog
            open={toolModals.calculator}
            onClose={() => handleToolClick("calculator")}
            tool={"calculator"}
            title={"Calculator"}
          />
          <ToolDragDialog
            open={toolModals.currency}
            onClose={() => handleToolClick("currency")}
            tool={"currency"}
            title={"Currency Converter"}
          />
          <ToolDragDialog
            open={toolModals.timer}
            onClose={() => handleToolClick("timer")}
            tool={"timer"}
            title={"Timer"}
          />
        </Box>
      </Drawer>
    </>
  );
};

export default LeftNavigation;
