import re

with open("deutsch-coach.html", "r", encoding="utf-8") as f:
    content = f.read()

helper = """function getGenderClass(card) {
  if (card.cat !== "n" || !card.a) return "";
  if (card.a === "der") return "gender-der";
  if (card.a === "die") return "gender-die";
  if (card.a === "das") return "gender-das";
  return "";
}
function getGenderBgClass(card) {
  if (card.cat !== "n" || !card.a) return "";
  if (card.a === "der") return "gender-bg-der";
  if (card.a === "die") return "gender-bg-die";
  if (card.a === "das") return "gender-bg-das";
  return "";
}"""

if "getGenderClass" not in content:
    content = content.replace("function promptIconHTML(card){", helper + "\nfunction promptIconHTML(card){")

# Regex replacements to inject the class call dynamically into JS template literals
# 1. <div class="word" ... >${card.w} <button
content = re.sub(
    r'<div class="word" (style="cursor:pointer;" onclick="const rb=document\.getElementById\(\'revealBtn\'\); if\(rb\)rb\.click\(\);")>\$\{card\.w\} <button',
    r'<div class="word ${getGenderClass(card)}" \1>${card.w} <button',
    content
)

# 2. <div class="word" ... >___ ${card.w}</div>
content = re.sub(
    r'<div class="word" (style="cursor:pointer;" onclick="const rb=document\.getElementById\(\'revealBtn\'\); if\(rb\)rb\.click\(\);")>___ \$\{card\.w\}</div>',
    r'<div class="word ${getGenderClass(card)}" \1>___ ${card.w}</div>',
    content
)

# 3. <div class="word" style="font-size:20px;">"${card.w}"</div>
content = re.sub(
    r'<div class="word" style="font-size:20px;">"\$\{card\.w\}"</div>',
    r'<div class="word ${getGenderClass(card)}" style="font-size:20px;">"${card.w}"</div>',
    content
)

# 4. <div class="artikel-tag">${card.a}</div>
content = re.sub(
    r'<div class="artikel-tag">\$\{card\.a\}</div>',
    r'<div class="artikel-tag ${getGenderBgClass(card)}">${card.a}</div>',
    content
)

with open("deutsch-coach.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Added gender classes to flashcards via regex")
