export async function GET() {

  const res = await fetch(
    `https://newsapi.org/v2/everything?q=iran OR saudi arabia OR usa war&apiKey=${process.env.NEWS_API_KEY}`
  )

  const data = await res.json()

  const text = data.articles.map((a: any) => a.title).join(" ").toLowerCase()

  const getStatus = (keywords: any) => {
    if (keywords.some((k: any) => text.includes(k))) return "ACTIVE"
    return "CALM"
  }

  const status = {
    iran: getStatus(["iran strike", "iran missile", "iran attack"]),
    saudiArabia: getStatus(["saudi attack", "saudi strike"]),
    usa: getStatus(["us strike", "us military attack"])
  }

  return Response.json(status)
}