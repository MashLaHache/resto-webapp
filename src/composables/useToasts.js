import { reactive } from "vue";

export const toasts = reactive([]);
export const miniToasts = reactive([]);

export class Toast {
  constructor(message, button = "ok", target = undefined, type = "error", timeout = undefined) {
    this.message = message;
    this.button = button;
    this.target = target;
    this.type = type;
    this.timeout = timeout;
    this.uuid = crypto.randomUUID();
  }
}


export class MiniToast {
  constructor(message, type = "error") {
    this.message = message;
    this.type = type;
    this.uuid = crypto.randomUUID();
  }
}