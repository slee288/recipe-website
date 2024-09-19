import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

/**
 * Testing Home Route - initial routing
 */
test("Render home page", () => {
  const { container: homeContainer } = render(<App />);

  // check if form is rendered
  const formElement = homeContainer.querySelector("#recipeSearch");
  // check if cuisines dropdown exists 
  const dropdownElement = homeContainer.querySelector(`select[name="cuisine"]`);

  // These do not exist - the recipe listing and pagination dropdown
  const recipeListingElement = homeContainer.querySelector(".recipe-listing");
  const paginationDropdown = homeContainer.querySelector(`select[name="page"]`);

  expect(formElement).toBeInTheDocument();
  expect(dropdownElement).toBeInTheDocument();
  expect(recipeListingElement).not.toBeInTheDocument();
  expect(paginationDropdown).not.toBeInTheDocument();
})

/**
 * Home route - test search
 */
test("Search on home page", async () => {
  const { container: homeContainer } = render(<App />);

  const inputElement = screen.getByLabelText("recipe-input");
  const submitButton = screen.getByText("Search");
  fireEvent.change(inputElement, { target: { value: "pasta" } });

  fireEvent.submit(submitButton);

  // check if the search result appears
  await waitFor(() => expect(homeContainer.querySelector(".recipe-listing")).toBeInTheDocument());
});

/**
 * Home route - invalid search
 */
test("Invalid search", async () => {
  const { container: homeContainer } = render(<App />);

  const inputElement = screen.getByLabelText("recipe-input");
  const submitButton = screen.getByText("Search");
  fireEvent.change(inputElement, { target: { value: "random test that would not work" } });

  fireEvent.submit(submitButton);

  // wait until the search
  await waitFor(() => expect(screen.getByText("No Results to Display")).toBeInTheDocument());
});