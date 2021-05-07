// Code by https://github.com/rphsoftware
// modified for TypeScript

const parameterLessFormatters = [
  "{","}","$",".","|","!",">","<","^","g","fr","fb","fi",
  "lson","lsoff","auto","msgreset","omo","aub","kel","her",
  "bas","he","him","his","mar","min","art","spxh","mai","swh",
  "smm","jaw","life","kim","cha","ang","mav","van","spg","spd",
  "spb","wis","ber","van","nos","bun","lad","dai","neb","hap",
  "eye","ban","shaw","ren","char","wee","hum","gra",
  "che","sna","swe","ems","ash","plu","due","cru","ros","kit",
  "sca","tvg","sha","may","sle","spo","che","spr","ban","toa","bun",
  "ma1","ma2","spe","hot","bud","tom","lea","ora","pro","str",
  "top","po","lar","fer","gum","gib","cre","duw","duj","duc","pes",
  "smo","gen","lue","pol","sou","tea","st1","st2","st3","dun","lau",
  "squ","dm1","dm2","dm3","mm1","mm2","joc","sp1","sp2","sp3","ear",
  "sbf","sxbf","cap","shb","sxhb","min","key","lb", "leclear","who",
  "#","'","\""," ","itemget","”","“"
]

const numeric = [
  "c","i","v","n","p","w","px","py","oc","ow","fs","af","ac","an","pf",
  "pc","pn","nc","ni","nw","na","ns","nt","ii","iw","ia","is","it",
  "lsv","lspi","lspiv","lspa","lspav","lsi","en","et","msgposx",
  "msgposy","msgevent","msgactor","msgparty","msgenemy","msgwidth",
  "msgrows","autoevent","autoactor","autoparty","autoenemy",
  "qi","qw","qa","amhp","ahp","ahp%","ammp","amp","amp%","amtp",
  "atp","atp%","aatk","adef","amat","amdf","aagi","aluk","ahit",
  "aeva","acri","acev","amev","amrf","acnt","ahrg","amrg","atrg",
  "agrd","arec","apha","amcr","atcr","apdr","amdr","afdr","aexr",
  "emhp","ehp","ehp%","emmp","emp","emp%","emtp","etp","etp%",
  "eatk","edef","emat","emdf","eagi","eluk","ehit","eeva","ecri",
  "ecev","emev","emrf","ecnt","ehrg","emrg","etrg","etgr","egrd",
  "erec","epha","emcr","etcr","epdr","emdr","efdr","eexr","m",
  "sinv","sinh","quake","rainbow","com","var","vara","vars",
  "varx","vard","varm","dii","bc"
]

const string = [
  "n","nc","nr","fn","lsn","nd","ndc","ndr","nt","ntc","ntr",
  "compare"
]

const literal = [
  "msgrows[auto]","msgwidth[auto]","msgposx[auto]","msgposy[auto]"
]

const complex = [
  "caseswitch","caseeval"
]

function escapeFunkyStuff(text: string) {
  const matches = text.matchAll(/(\{|\}|\$|\.|\||!|>|<|\^|%|\[|\]|#|'|"| )/gmi)
  const z = new Set()
  for (const o of matches) {
    if (z.has(o[1])) continue

    text = text.replace(new RegExp("\\" + o[1], "gmi"), "\\" + o[1])
  }

  return text
}

const retval: {
  regular: Record<string, RegExp>
  regular2: Record<string, RegExp>
  numeric: Record<string, RegExp>
  string: Record<string, RegExp>
  complex: Record<string, RegExp>
} = {
  regular: {},
  numeric: {},
  string: {},
  complex: {},
  regular2: {}
}

for (const o of parameterLessFormatters) {
  retval.regular[o] = new RegExp("\\\\" + escapeFunkyStuff(o), "gmi")
}

for (const o of literal) {
  retval.regular2[o] = new RegExp("\\\\" + escapeFunkyStuff(o), "gmi")
}

for (const o of numeric) {
  retval.numeric[o] = new RegExp("\\\\" + escapeFunkyStuff(o) + "\\[([^\\]]+)\\]", "gmi")
}

for (const o of string) {
  retval.string[o] = new RegExp("\\\\" + escapeFunkyStuff(o) + "\\<([^\\>]+)\\>", "gmi")
}

for (const o of complex) {
  retval.complex[o] = new RegExp("\\\\" + escapeFunkyStuff(o) + "\\{([^\\}]+)\\}", "gmi")
}

function makeid(length: number)
{
  let text = ""
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for(let i=0; i < length; i++)
  {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

const splitter = makeid(512)

function testWithRegexp(text: string, regularExpression: RegExp, identifier: string, type: string) {
  if (!text.match(regularExpression)) return [{type:"text", text}]
  else {
    const data = text.matchAll(regularExpression)
    if (type === "literal") {
      const retval = []
      const d = text.split(regularExpression)
          
      for (let i = 0; i < (d.length-1); i++) {
        retval.push({type:"text", text:d[i]})
        retval.push({type:"literal",operator:identifier})
      }
      retval.push({type:"text",text:d[d.length-1]})

      return retval
    } else {
      const retval = []
      const params = []
      for (const a of data) { params.push(a[1]) }

      text = text.replace(regularExpression, splitter)
      const d = text.split(splitter)
      for (let i = 0; i < (d.length-1); i++) {
        retval.push({type:"text", text:d[i]})
        retval.push({type,operator:identifier,params: params[i]})
      }
      retval.push({type:"text",text:d[d.length-1]})

      return retval
    }
  }
}

function extractOperators(component: string|undefined) {
  let results = [{
    type: "text",
    text: component
  }]
  const res = retval

  for (const k in res.regular2) {
    const nr = []
    for (let i = 0; i < results.length; i++) {
      if (results[i].type === "text") {
        const reslt = testWithRegexp(results[i].text, res.regular2[k], k, "literal")
        for (const a of reslt) {
          nr.push(a)
        }
      } else {
        nr.push(results[i])
      }
    }

    results = nr
  }

  for (const k in res.complex) {
    const nr = []
    for (let i = 0; i < results.length; i++) {
      if (results[i].type === "text") {
        const reslt = testWithRegexp(results[i].text, res.complex[k], k, "complex")
        for (const a of reslt) {
          nr.push(a)
        }
      } else {
        nr.push(results[i])
      }
    }

    results = nr
  }

  for (const k in res.string) {
    const nr = []
    for (let i = 0; i < results.length; i++) {
      if (results[i].type === "text") {
        const reslt = testWithRegexp(results[i].text, res.string[k], k, "string")
        for (const a of reslt) {
          nr.push(a)
        }
      } else {
        nr.push(results[i])
      }
    }

    results = nr
  }

  for (const k in res.numeric) {
    const nr = []
    for (let i = 0; i < results.length; i++) {
      if (results[i].type === "text") {
        const reslt = testWithRegexp(results[i].text, res.numeric[k], k, "numeric")
        for (const a of reslt) {
          nr.push(a)
        }
      } else {
        nr.push(results[i])
      }
    }

    results = nr
  }

  for (const k in res.regular) {
    const nr = []
    for (let i = 0; i < results.length; i++) {
      if (results[i].type === "text") {
        const reslt = testWithRegexp(results[i].text, res.regular[k], k, "literal")
        for (const a of reslt) {
          nr.push(a)
        }
      } else {
        nr.push(results[i])
      }
    }

    results = nr
  }

  return results
}

function parseText(text: string) {
  const output = []
  // do BRs
  const t = text.split(/<br>/gmi)

  for (let i = 0; i < (t.length - 1); i++) {
    output.push({type:"text",text:t[i]})
    output.push({type:"br"})
  }
  
  output.push({type:"text", text:t[t.length-1]})

  const newOutput = []

  for (const o of output) {
    if (o.type === "br") newOutput.push(o)
    else {
      const z = extractOperators(o.text)
      for (const e of z) {
        newOutput.push(e)
      }
    }
  }

  return newOutput
}

export default parseText