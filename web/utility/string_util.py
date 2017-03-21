

# checks if string s has any of the strings in list targetStrings
def stringHasTargetStrings(s, target_strings):
	for target_string in target_strings:
		if s.find(target_string) != - 1:
			return True
	return False