import type { Identifiable, Summarizable } from "./contracts";

/**
 * Abstract base class for all persistent domain entities in (SP) Pamilihub.
 *
 * Demonstrates:
 * - Abstraction: cannot be instantiated directly; forces subclasses to implement `toSummary()`.
 * - Encapsulation: `protected` fields with controlled read-only getters.
 */
export abstract class BaseEntity implements Identifiable, Summarizable {
  protected readonly id: string;
  protected readonly createdAt: Date;

  constructor(id: string, createdAt: Date = new Date()) {
    if (!id || id.trim().length === 0) {
      throw new Error("Entity ID cannot be empty.");
    }
    this.id = id.trim();
    this.createdAt = createdAt; 
  }

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return new Date(this.createdAt.getTime());
  }

  /** Subclasses must provide a human-readable summary of their state. */
  public abstract toSummary(): string;
}
