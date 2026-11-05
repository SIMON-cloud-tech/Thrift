import { Helmet } from 'react-helmet-async';

const SITE = 'Drip Mtaani';

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogUrl,
  canonicalUrl,
  structuredData,
  noIndex = false,
  additionalMeta = []
}) => {
  const fullTitle = title ? `${title} | ${SITE}` : SITE;
  const desc = description || "Authentic street footwear in Nairobi. Shop sneakers, Timberland boots, and office shoes — real sizes, M-Pesa checkout, and same-day delivery.";
  const kw = keywords || 'shoes Nairobi, sneakers Kenya, Timberland boots Kenya, office shoes Nairobi, buy shoes online Kenya, Drip Mtaani';
  const baseUrl = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '') || 'https://www.dripmtaani.co.ke';
  const image = ogImage || `${baseUrl}/logo.png`;
  const canonical = canonicalUrl || `${baseUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={kw} />
      <meta name="author" content={SITE} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl || canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE} />
      <meta property="og:locale" content="en_KE" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={ogUrl || canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${SITE} — authentic street footwear`} />

      <meta name="theme-color" content="#0F6B3C" />
      <meta name="msapplication-TileColor" content="#0F6B3C" />

      {additionalMeta.map((m, i) => <meta key={i} {...m} />)}

      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
};

export default SEO;