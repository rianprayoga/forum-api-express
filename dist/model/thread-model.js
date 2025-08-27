"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toThreadResponse = toThreadResponse;
function toThreadResponse(thread) {
    return {
        id: thread.id,
        title: thread.title,
        content: thread.content,
        createdDate: thread.createdDate,
        updatedDate: thread.updatedDate === null ? thread.createdDate : thread.updatedDate,
    };
}
