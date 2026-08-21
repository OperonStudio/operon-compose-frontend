import { cx } from "@morph-css/kit";
import { Bell, Check, ChevronDown, Search } from "@operonstudio/icons";
import { Box, Breadcrumb, Button, Input } from "@operonstudio/ui";
import React, { useEffect, useRef, useState } from "react";
import * as wsClasses from "../workspace-switcher/style";
import { useHeader } from "./hooks";
import * as classes from "./style";

export function Header() {
  const {
    breadcrumbItems,
    isSearchable,
    searchBarPlaceholder,
  } = useHeader();

  return (
    <Box className={classes.topbarStyle.className}>
      <Box className={classes.desktopBreadcrumbStyle.className}>
        <Breadcrumb items={breadcrumbItems} />
      </Box>

      {isSearchable && (
        <Box className={classes.searchContainerStyle.className}>
          <Input
            startIcon={<Search size={16} />}
            placeholder={searchBarPlaceholder}
            fullWidth
            variant="filled"
          />
        </Box>
      )}

      <Box className={classes.rightActionsStyle.className}>
        <Button variant="ghost" size="sm" {...classes.iconButtonStyle} rounded>
          <Bell size={16} color="var(--operon-color-text-muted)" />
        </Button>
      </Box>
    </Box>
  );
}

export function MobileEnvironmentSelector() {
  const { environments, activeEnvironment, switchEnvironment } = useHeader();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (environments.length === 0) return null;

  return (
    <Box
      ref={dropdownRef}
      className={wsClasses.containerStyle.className}
      style={{
        ...wsClasses.containerStyle.style,
        zIndex: isOpen ? 1000 : 90,
      }}
    >
        {/* Trigger button */}
        <Box
          onClick={() => setIsOpen(!isOpen)}
          className={cx(
            wsClasses.triggerBoxStyle.className,
            isOpen ? wsClasses.triggerBoxHoverStyle.className : "",
          )}
          style={{
            ...wsClasses.triggerBoxStyle.style,
            ...(isOpen ? wsClasses.triggerBoxHoverStyle.style : {}),
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
            if (!isOpen) {
              (e.currentTarget as HTMLDivElement).style.background =
                wsClasses.triggerBoxHoverStyle.style?.background as string;
            }
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
            if (!isOpen) {
              (e.currentTarget as HTMLDivElement).style.background =
                "transparent";
            }
          }}
        >
          <Box {...wsClasses.textContainerStyle}>
            <Box {...wsClasses.textNameStyle}>
              {activeEnvironment?.name ?? "Select Environment"}
            </Box>
            <Box {...wsClasses.textSubtitleStyle}>Environment</Box>
          </Box>
          <ChevronDown
            size={14}
            color="var(--operon-color-text-muted)"
            style={{
              transition: "transform 0.2s",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Box>

        {/* Dropdown panel */}
        {isOpen && (
          <Box {...wsClasses.dropdownPanelStyle}>
            <Box {...wsClasses.listContainerStyle}>
              {environments.map((env) => {
                const isActive = activeEnvironment?.id === env.id;
                return (
                  <Box
                    key={env.id}
                    onClick={() => {
                      switchEnvironment(env.id);
                      setIsOpen(false);
                    }}
                    className={cx(
                      wsClasses.listItemStyle.className,
                      isActive ? wsClasses.listItemActiveStyle.className : "",
                    )}
                    style={{
                      ...wsClasses.listItemStyle.style,
                      ...(isActive ? wsClasses.listItemActiveStyle.style : {}),
                      color: isActive
                        ? "var(--operon-color-primary)"
                        : "var(--operon-color-text)",
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLDivElement).style.background =
                          wsClasses.listItemHoverStyle.style?.background as string;
                      }
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLDivElement).style.background =
                          "transparent";
                      }
                    }}
                  >
                    <Box {...wsClasses.listItemTextStyle}>{env.name}</Box>
                    {isActive && (
                      <Check size={13} color="var(--operon-color-primary)" />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
  );
}

export function SubHeaderBreadcrumbs() {
  const { breadcrumbItems } = useHeader();
  return <Breadcrumb items={breadcrumbItems} />;
}
