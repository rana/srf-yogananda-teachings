/**
 * next-intl navigation helpers — M2a-17.
 *
 * Provides locale-aware Link, redirect, and usePathname.
 */

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
