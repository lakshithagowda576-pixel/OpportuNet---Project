// @ts-nocheck
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Unauthorized. Please log in." });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Unauthorized. Please log in." });
    return;
  }
  if (req.session?.userRole !== "admin" && req.session?.userRole !== "hr") {
    res.status(403).json({ error: "Forbidden. Admin or HR access required." });
    return;
  }
  next();
}

export function requireAdminOnly(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Unauthorized. Please log in." });
    return;
  }
  if (req.session?.userRole !== "admin") {
    res.status(403).json({ error: "Forbidden. Admin access required." });
    return;
  }
  next();
}
