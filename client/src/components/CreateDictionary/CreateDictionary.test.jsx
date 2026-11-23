import React from "react";
import axios from "axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { CreateDictionary } from "./CreateDictionary";

vi.mock("axios", () => ({ default: { post: vi.fn() } }));

beforeEach(() => {
  window.localStorage.clear();
  axios.post.mockReset();
});

async function fillInSpomenar() {
  fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Weekend spomenar" } });
  fireEvent.change(screen.getByLabelText("Description"), { target: { value: "A trip with friends" } });
  fireEvent.click(screen.getByRole("button", { name: "Add Questions" }));
  const question = await screen.findByPlaceholderText("Enter the question text...");
  fireEvent.change(question, { target: { value: "Where would you go?" } });
  fireEvent.click(screen.getByRole("button", { name: "Done" }));
}

it("lets a guest create and reopen a local practice spomenar without posting it", async () => {
  const page = render(<CreateDictionary practice />);
  await fillInSpomenar();

  fireEvent.click(screen.getByRole("button", { name: "Preview spomenar" }));
  expect(screen.getByRole("heading", { name: "Weekend spomenar" })).toBeInTheDocument();
  expect(screen.getByText("A trip with friends")).toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox", { name: "Where would you go?" }), {
    target: { value: "To the coast" },
  });
  page.unmount();

  render(<CreateDictionary practice />);
  expect(screen.getByLabelText("Title")).toHaveValue("Weekend spomenar");
  expect(screen.getByLabelText("Description")).toHaveValue("A trip with friends");
  fireEvent.click(screen.getByRole("button", { name: "Preview spomenar" }));
  expect(screen.getByRole("textbox", { name: "Where would you go?" })).toHaveValue("To the coast");
  fireEvent.click(screen.getByRole("button", { name: "Back to editing" }));
  fireEvent.click(screen.getByRole("button", { name: "Delete question 1" }));
  expect(screen.queryByText(/Where would you go/)).not.toBeInTheDocument();
  expect(axios.post).not.toHaveBeenCalled();
});

it("keeps the signed-in submission on the existing API path", async () => {
  axios.post.mockResolvedValue({ data: { _id: "server-id" } });
  render(<CreateDictionary user={{ id: "owner-id", username: "owner" }} token="owner-token" />);
  await fillInSpomenar();
  fireEvent.click(screen.getByRole("button", { name: "Finish Dictionary" }));
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));
  const config = { headers: { "Content-Type": "application/json", "x-auth-token": "owner-token" } };
  expect(axios.post).toHaveBeenNthCalledWith(1, "/api/dicts", {
    author: "owner-id", author_username: "owner", title: "Weekend spomenar", description: "A trip with friends",
  }, config);
  expect(axios.post).toHaveBeenNthCalledWith(2, "/api/quests", {
    dictionary: "server-id", questions: [{ question: "Where would you go?", type: "open", choices: [], order: 0 }],
  }, config);
});
