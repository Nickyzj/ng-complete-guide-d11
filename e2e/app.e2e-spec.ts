import { Ng4CompleteGuideD11Page } from './app.po';

describe('ng4-complete-guide-d11 App', () => {
  let page: Ng4CompleteGuideD11Page;

  beforeEach(() => {
    page = new Ng4CompleteGuideD11Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
