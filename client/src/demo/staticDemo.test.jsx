import React from "react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import App from "../App";
import staticDemoAdapter from "./staticDemoAdapter";

it.runIf(import.meta.env.STATIC_DEMO)("runs the public demo with bundled data and no API network requests", async () => {
  const oldAdapter = axios.defaults.adapter;
  axios.defaults.adapter = staticDemoAdapter;
  const openRequest = vi.spyOn(XMLHttpRequest.prototype, "open");
  const page = render(<MemoryRouter><App /></MemoryRouter>);

  try {
    expect(screen.queryByText("Owner login")).not.toBeInTheDocument();
    fireEvent.click(await screen.findByRole("link", { name: "Spomenar za ekipu" }));
    expect(await screen.findByText("Izlet na more koji smo dogovorili isti dan.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next question" }));
    expect(await screen.findByText("Kako izgleda tvoj idealan vikend?")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Try answering" }));
    const answer = await screen.findByRole("textbox", { name: "Koja ti je najdraža uspomena s ekipom?" });
    fireEvent.change(answer, { target: { value: "Kampiranje" } });
    fireEvent.click(screen.getByRole("button", { name: "Read" }));
    fireEvent.click(screen.getByRole("button", { name: "Try answering" }));
    expect(await screen.findByDisplayValue("Kampiranje")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Try creating" }));
    expect(screen.getByRole("heading", { name: "Create a practice spomenar" })).toBeInTheDocument();
    expect(openRequest).not.toHaveBeenCalled();
  } finally {
    page.unmount();
    axios.defaults.adapter = oldAdapter;
    openRequest.mockRestore();
  }
});
