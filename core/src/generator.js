import { _assert, _debug, isNatural } from "~/util/debug";
import { Diagram } from "~/diagram";
import { Content } from "~/limit";

export class Generator {

  constructor(id, source = null, target = null) {
    if (_debug) _assert(id !== undefined);
    if (_debug) _assert(source == null || source instanceof Diagram);
    if (_debug) _assert(target == null || target instanceof Diagram);

    this.n = source == null ? 0 : source.n + 1;
    this.source = source;
    this.target = target;
    this.id = id;

    if (this.n > 1) {
      if (_debug) _assert(source.source.equals(target.source));
      if (_debug) _assert(source.getTarget().equals(target.getTarget()));
    }

    // Build content
    if (this.n > 0) {
      let first_limit = this.source.contractForwardLimit(this, null, null);
      let singular_height = first_limit.rewrite_forward(this.source);
      let second_limit_forwards = this.target.contractForwardLimit(this, null, null);
      this.content = new Content(this.n - 1, first_limit, second_limit_forwards);
    }

    // Build diagram
    if (this.n == 0) {
      this.diagram = new Diagram(0, {
        type: this
      });
    } else {
      this.diagram = new Diagram(this.n, {
        source: this.source,
        data: [this.content]
      });
    }

    Object.freeze(this);
  }

  toJSON() {
    return {
      id: this.id,
      source: this.source,
      target: this.target,
      n: this.n
    };
  }

  validate() {
    if (_debug) _assert(this.n == 0 || this.source);
  }

  // Mirror a generator
  mirror(n) {
    if (n == 0) {
      var temp = this.source;
      this.source = this.target;
      this.target = temp;
    } else if (n == 1) {
      this.source = this.source.mirror(0);
      this.target = this.target.mirror(0);
    }
    return this;
  }

  getType() {
    return "Generator";
  }

  getBoundingBox() {
    var box = {
      min: Array(Math.max(0, this.n - 1)).fill(0),
      max: this.source == null ? [] : this.source.getLengthsAtSource()
    };
    return box;
  }

  usesCell(generator) {
    if (this.id == generator.id) {
      return true;
    }

    // Generators can only use cells which have a lower dimension
    if (generator.n >= this.n) {
      return false;
    }

    // The generator uses the specified cell iff the source or target uses it
    if (this.source != null) {
      if (this.source.usesCell(generator)) {
        return true;
      }

      if (this.target.usesCell(generator)) {
        return true;
      }
    }

    return false;
  }

}