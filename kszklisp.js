function tokenize(input, delimiter = " ") {
  let tokens = [];
  let current_token = "";

  let in_parentheses = 0;
  let in_quote = false;
  let is_escape = false;

  const chars = input.split("");
  let index = 0;

  while (index < chars.length) {
    let c = chars[index];
    if (is_escape) {
      current_token += c;
      is_escape = false;
    } else {
      if (c === "(" && !in_quote) {
        current_token += c;
        in_parentheses += 1;
      } else if (c === ")" && !in_quote) {
        current_token += c;
        in_parentheses -= 1;
      } else if (c === '"') {
        in_quote = !in_quote;
        current_token += c;
      } else if (c === "\\" && in_quote) {
        current_token += c;
        is_escape = true;
      } else if (input.slice(index, index + delimiter.length) == delimiter) {
        if (in_parentheses != 0 || in_quote || is_escape) {
          current_token += delimiter;
        } else if (current_token !== "") {
          tokens.push(current_token);
          current_token = "";
        }
        index += delimiter.length;
        continue;
      } else {
        current_token += c;
      }
    }
    index += 1;
  }

  if (current_token !== "") {
    tokens.push(current_token);
    current_token = "";
  }
  return tokens;
}

function parse(source) {
  source = source.trim();
  if (source.startsWith("(") && source.endsWith(")")) {
    return tokenize(source.slice(1, source.length - 1)).map(parse);
  } else {
    return source;
  }
}

function lispEval(list) {
  function call(op, args) {
    try {
      return eval(args.join(` ${op} `));
    } catch {
      try {
        return eval(op)(...args);
      } catch {
        return null;
      }
    }
  }

  if (Array.isArray(list)) {
    const args = list.slice(1).map(lispEval);
    return call(list[0], args);
  } else {
    return eval(list);
  }
}

const kszklisp = (expr) => lispEval(parse(expr));

kszklisp('(console.log "Hello")');
