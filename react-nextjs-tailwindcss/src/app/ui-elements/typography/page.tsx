import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Typography</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard/ecommerce/"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            UI Elements
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Typography
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        <div>
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Headings</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <h1>h1. Bootstrap heading</h1>
              <h2>h2. Bootstrap heading</h2>
              <h3>h3. Bootstrap heading</h3>
              <h4>h4. Bootstrap heading</h4>
              <h5>h5. Bootstrap heading</h5>
              <h6>h6. Bootstrap heading</h6>
            </div>
          </div>
        </div>

        <div>
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">
                  <span className="text-danger-500">.h1</span> through{" "}
                  <span className="text-danger-500">.h6</span> Classes are also
                  Available
                </h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <div className="h1">h1. Bootstrap heading</div>
              <div className="h2">h2. Bootstrap heading</div>
              <div className="h3">h3. Bootstrap heading</div>
              <div className="h4">h4. Bootstrap heading</div>
              <div className="h5">h5. Bootstrap heading</div>
              <div className="h6">h6. Bootstrap heading</div>
            </div>
          </div>
        </div>

        <div>
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Customizing Headings</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <h3>
                Fancy display heading
                <small className="text-gray-500 dark:text-gray-400">
                  With faded secondary text
                </small>
              </h3>
            </div>
          </div>
          
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Lead</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <p className="text-[1.25rem] font-light">
                This is a lead paragraph. It stands out from regular paragraphs.
              </p>
            </div>
          </div>

          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Blockquotes</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <blockquote className="text-[1.25rem] bg-gray-50 p-[20px] md:p-[25px] dark:bg-[#172036]">
                <p>A well-known quote, contained in a blockquote element.</p>
              </blockquote>
            </div>
          </div>

          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Naming a Source</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <blockquote className="text-[1.25rem] bg-gray-50 p-[20px] md:p-[25px] dark:bg-[#172036]">
                <p className="!mb-[10px]">
                  A well-known quote, contained in a blockquote element.
                </p>
                <figcaption className="text-sm italic text-black dark:text-white">
                  - Someone famous in{" "}
                  <cite title="Source Title">Source Title</cite>
                </figcaption>
              </blockquote>
            </div>
          </div>

          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Inline Text Elements</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <p>
                You can use the mark tag to <mark>highlight</mark> text.
              </p>
              <p>
                <del>
                  This line of text is meant to be treated as deleted text.
                </del>
              </p>
              <p>
                <s>
                  This line of text is meant to be treated as no longer
                  accurate.
                </s>
              </p>
              <p>
                <ins>
                  This line of text is meant to be treated as an addition to the
                  document.
                </ins>
              </p>
              <p>
                <u>This line of text will render as underlined.</u>
              </p>
              <p>
                <small>
                  This line of text is meant to be treated as fine print.
                </small>
              </p>
              <p>
                <strong>This line rendered as bold text.</strong>
              </p>
              <p>
                <em>This line rendered as italicized text.</em>
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Display Headings</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <h1 className="!display-1">Display 1</h1>
              <h1 className="!display-2">Display 2</h1>
              <h1 className="!display-3">Display 3</h1>
              <h1 className="!display-4">Display 4</h1>
              <h1 className="!display-5">Display 5</h1>
              <h1 className="!display-6">Display 6</h1>
            </div>
          </div>

          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Blockquotes Alignment</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <blockquote className="text-center text-[1.25rem] bg-gray-50 p-[20px] md:p-[25px] dark:bg-[#172036]">
                <p className="!mb-[10px]">
                  A well-known quote, contained in a blockquote element.
                </p>
                <figcaption className="text-sm italic text-black dark:text-white">
                  - Someone famous in{" "}
                  <cite title="Source Title">Source Title</cite>
                </figcaption>
              </blockquote>
            </div>
          </div>

          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-content">
              <blockquote className="ltr:text-right rtl:text-left text-[1.25rem] bg-gray-50 p-[20px] md:p-[25px] dark:bg-[#172036]">
                <p className="!mb-[10px]">
                  A well-known quote, contained in a blockquote element.
                </p>
                <figcaption className="text-sm italic text-black dark:text-white">
                  - Someone famous in{" "}
                  <cite title="Source Title">Source Title</cite>
                </figcaption>
              </blockquote>
            </div>
          </div>

          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Abbreviations</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <p>
                <abbr title="attribute">attr</abbr>
              </p>
              <p>
                <abbr title="HyperText Markup Language" className="initialism">
                  HTML
                </abbr>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
