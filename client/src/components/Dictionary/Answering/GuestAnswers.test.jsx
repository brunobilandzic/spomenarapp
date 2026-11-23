import React from "react";
import axios from "axios";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import GuestAnswers from "./GuestAnswers";

vi.mock("axios", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

it("restores text and radio answers for the same spomenar without posting them", async () => {
  window.localStorage.clear();
  axios.get.mockResolvedValue({
    data: [
      {
        _id: "text", order: 0, question: "Where would you go?", type: "open", choices: [],
      },
      {
        _id: "choice", order: 1, question: "How would you travel?", type: "multiple_choice",
        choices: [{ letter: "a", choice: "By train" }],
      },
      {
        _id: "approval", order: 2, question: "Would you go again?", type: "acceptance", choices: [],
      },
    ],
  });

  const first = render(<GuestAnswers dictId="sample" />);
  const input = await screen.findByRole("textbox", { name: "Where would you go?" });
  fireEvent.change(input, { target: { value: "The coast" } });
  fireEvent.click(screen.getByRole("radio", { name: "By train" }));
  fireEvent.click(screen.getByRole("radio", { name: "Yes" }));
  first.unmount();

  const restored = render(<GuestAnswers dictId="sample" />);
  expect(await screen.findByDisplayValue("The coast")).toBeInTheDocument();
  expect(screen.getByRole("radio", { name: "By train" })).toBeChecked();
  expect(screen.getByRole("radio", { name: "Yes" })).toBeChecked();
  restored.unmount();

  render(<GuestAnswers dictId="another-sample" />);
  expect(await screen.findByRole("textbox", { name: "Where would you go?" })).toHaveValue("");
  expect(screen.getByRole("radio", { name: "Yes" })).not.toBeChecked();
  expect(axios.post).not.toHaveBeenCalled();
});
