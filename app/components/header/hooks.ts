import { getPageContentOptions } from "#/common/api/content-api";
import { useActiveEnvironment } from "#/modules/environments/hooks";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import React from "react";

export const useHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const collectionId = pathnames[0];

  const breadcrumbItems = [
    {
      label: "Operon",
      href: "/",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        navigate({ to: "/" });
      },
    },
    ...pathnames.map((path, index) => {
      const href = `/${pathnames.slice(0, index + 1).join("/")}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      return {
        label,
        href,
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          navigate({ to: href });
        },
      };
    }),
  ];

  const { data: pageData } = useQuery({
    ...getPageContentOptions(collectionId),
    enabled: !!collectionId,
  });

  const {
    enabled: isSearchable = false,
    placeholder: searchBarPlaceholder = "",
  } = pageData?.page?.search || {};

  const { environments, activeEnvironment, switchEnvironment } =
    useActiveEnvironment();

  return {
    breadcrumbItems,
    isSearchable,
    searchBarPlaceholder,
    environments,
    activeEnvironment,
    switchEnvironment,
  };
};
