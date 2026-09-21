import re

def extract_and_inject():
    with open("Deutsch_Wortschatz_Excel_Sheet.html", "r", encoding="utf-8", errors="surrogateescape") as f:
        content = f.read()

    # Find NOUN_MNEMONIC_DB
    noun_match = re.search(r'(const NOUN_MNEMONIC_DB = \{[\s\S]*?\n\s*};\n)', content)
    # Find VERB_MNEMONIC_DB
    verb_match = re.search(r'(const VERB_MNEMONIC_DB = \{[\s\S]*?\n\s*};\n)', content)
    # Find ROOT_MNEMONIC_DB
    root_match = re.search(r'(const ROOT_MNEMONIC_DB = \{[\s\S]*?\n\s*};\n)', content)
    # Find PREFIX_METAPHORS
    prefix_match = re.search(r'(const PREFIX_METAPHORS = \{[\s\S]*?\n\s*};\n)', content)

    extracted = ""
    if noun_match: extracted += noun_match.group(1) + "\n"
    if verb_match: extracted += verb_match.group(1) + "\n"
    if root_match: extracted += root_match.group(1) + "\n"
    if prefix_match: extracted += prefix_match.group(1) + "\n"

    if extracted:
        with open("js/tamil-dict.js", "w", encoding="utf-8", errors="surrogateescape") as f:
            f.write(extracted)
        print("Created js/tamil-dict.js")
    
        # Now remove them from the 4 files
        files_to_patch = ["Deutsch_Wortschatz_Excel_Sheet.html", "Verb_Transformation_Trainer.html", "Wortschatz_Master_Grid.html", "WMG_remote.html"]
        for fname in files_to_patch:
            try:
                with open(fname, "r", encoding="utf-8", errors="surrogateescape") as f:
                    file_content = f.read()
                
                # Replace definitions
                for match in [noun_match, verb_match, root_match, prefix_match]:
                    if match:
                        # Need to be careful: the regex might not match EXACTLY due to slight whitespace drift.
                        # So let's use regex to find and remove the blocks in the target files.
                        pass
                
                # Actually, using regex to strip blocks starting with `const NOUN_MNEMONIC_DB = {` and ending with the corresponding `};`
                file_content = re.sub(r'const (NOUN_MNEMONIC_DB|VERB_MNEMONIC_DB|ROOT_MNEMONIC_DB|PREFIX_METAPHORS) = \{[\s\S]*?\n\s*\};\n', '', file_content)
                
                # Inject script tag
                if '<script src="js/tamil-dict.js"></script>' not in file_content:
                    file_content = file_content.replace('<script src="js/app-shell.js"></script>', '<script src="js/tamil-dict.js"></script>\n  <script src="js/app-shell.js"></script>')
                    if '<script src="js/tamil-dict.js"></script>' not in file_content:
                        file_content = file_content.replace('</body>', '<script src="js/tamil-dict.js"></script>\n</body>')

                with open(fname, "w", encoding="utf-8", errors="surrogateescape") as f:
                    f.write(file_content)
                print(f"Patched {fname}")
            except Exception as e:
                print(f"Failed to patch {fname}: {e}")

extract_and_inject()
