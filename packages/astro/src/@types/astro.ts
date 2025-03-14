import type { ImportSpecifier, ImportDefaultSpecifier, ImportNamespaceSpecifier } from '@babel/types';
import type { AstroMarkdownOptions } from '@astrojs/markdown-support';

export interface AstroConfigRaw {
  dist: string;
  projectRoot: string;
  src: string;
  pages: string;
  public: string;
  jsx?: string;
}

export { AstroMarkdownOptions };
export interface AstroConfig {
  dist: string;
  projectRoot: URL;
  pages: URL;
  public: URL;
  src: URL;
  renderers?: string[];
  /** Options for rendering markdown content */
  markdownOptions?: Partial<AstroMarkdownOptions>;
  /** Options specific to `astro build` */
  buildOptions: {
    /** Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs. */
    site?: string;
    /** Generate sitemap (set to "false" to disable) */
    sitemap: boolean;
  };
  /** Options for the development server run with `astro dev`. */
  devOptions: {
    /** The port to run the dev server on. */
    port: number;
    projectRoot?: string;
    /** Path to tailwind.config.js, if used */
    tailwindConfig?: string;
  };
}

export type AstroUserConfig = Omit<AstroConfig, 'buildOptions' | 'devOptions'> & {
  buildOptions: {
    sitemap: boolean;
  };
  devOptions: {
    port?: number;
    projectRoot?: string;
    tailwindConfig?: string;
  };
};

export interface JsxItem {
  name: string;
  jsx: string;
}

export interface TransformResult {
  script: string;
  imports: string[];
  exports: string[];
  html: string;
  css?: string;
  /** If this page exports a collection, the JS to be executed as a string */
  createCollection?: string;
  hasCustomElements: boolean;
  customElementCandidates: Map<string, string>;
}

export interface CompileResult {
  result: TransformResult;
  contents: string;
  css?: string;
}

export type RuntimeMode = 'development' | 'production';

export type Params = Record<string, string | number>;

/** Entire output of `astro build`, stored in memory */
export interface BuildOutput {
  [dist: string]: BuildFile;
}

export interface BuildFile {
  /** The original location. Needed for code frame errors. */
  srcPath: URL;
  /** File contents */
  contents: string | Buffer;
  /** File content type (to determine encoding, etc) */
  contentType: string;
  /** Encoding */
  encoding?: 'utf8';
}

/** Mapping of every URL and its required assets. All URLs are absolute relative to the project. */
export type BundleMap = {
  [pageUrl: string]: PageDependencies;
};

export interface PageDependencies {
  /** JavaScript files needed for page. No distinction between blocking/non-blocking or sync/async. */
  js: Set<string>;
  /** CSS needed for page, whether imported via <link>, JS, or Astro component. */
  css: Set<string>;
  /** Images needed for page. Can be loaded via CSS, <link>, or otherwise. */
  images: Set<string>;
}

export interface CreateCollection<T = any> {
  data: ({ params }: { params: Params }) => T[];
  routes?: Params[];
  /** tool for generating current page URL */
  permalink?: ({ params }: { params: Params }) => string;
  /** page size */
  pageSize?: number;
  /** Generate RSS feed from data() */
  rss?: CollectionRSS<T>;
}

export interface CollectionRSS<T = any> {
  /** (required) Title of the RSS Feed */
  title: string;
  /** (required) Description of the RSS Feed */
  description: string;
  /** Specify arbitrary metadata on opening <xml> tag */
  xmlns?: Record<string, string>;
  /** Specify custom data in opening of file */
  customData?: string;
  /** Return data about each item */
  item: (item: T) => {
    /** (required) Title of item */
    title: string;
    /** (required) Link to item */
    link: string;
    /** Publication date of item */
    pubDate?: Date;
    /** Item description */
    description?: string;
    /** Append some other XML-valid data to this item */
    customData?: string;
  };
}

export interface CollectionResult<T = any> {
  /** result */
  data: T[];

  /** metadata */
  /** the count of the first item on the page, starting from 0 */
  start: number;
  /** the count of the last item on the page, starting from 0 */
  end: number;
  /** total number of results */
  total: number;
  page: {
    /** the current page number, starting from 1 */
    current: number;
    /** number of items per page (default: 25) */
    size: number;
    /** number of last page */
    last: number;
  };
  url: {
    /** url of the current page */
    current: string;
    /** url of the previous page (if there is one) */
    prev?: string;
    /** url of the next page (if there is one) */
    next?: string;
  };
  /** Matched parameters, if any */
  params: Params;
}

export interface ComponentInfo {
  url: string;
  importSpecifier: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier;
}

export type Components = Map<string, ComponentInfo>;

export interface AstroComponentMetadata {
  displayName: string;
  hydrate?: 'load' | 'idle' | 'visible' | 'media';
  componentUrl?: string;
  componentExport?: { value: string; namespace?: boolean };
  value?: undefined | string;
}

type AsyncRendererComponentFn<U> = (Component: any, props: any, children: string | undefined, metadata?: AstroComponentMetadata) => Promise<U>;

export interface Renderer {
  check: AsyncRendererComponentFn<boolean>;
  renderToStaticMarkup: AsyncRendererComponentFn<{
    html: string;
  }>;
}
