# coding: utf-8

import re
from webbrowser import get
import stanza
from GTree import GTree, NB
from StanzaSeparateConj import getGoal
s = {NB: 'Normal Behavior'}


#要求記述解析を行うクラスの本体。
class GoalModelConstructor:
	def __init__(self, format='png', logfile=None, blur=None):
		self.goalmodel = GTree(format)
		self.__log = logfile
		#self.__effect = blur
		
		self.logs = [] #ログのリスト。ここにログを保存し、writeLog()の処理で外部ファイルに出力する。
		self.goal_node = None #今扱っているゴールモデルの頂点。

	def analyzeSpecification(self, text):
		self.goalmodel.formatGraph()

		for line in text.splitlines():
			if not re.match(r'[G|0-9].*', line):
				continue
			self.addGoal(line)

		return self.goalmodel.render()

	def addGoal(self, line):
		print(line)
		#print(line.split(' ')[1])
		goal_id = '.' + line.split(' ')[0].replace('Goal ', '')
		goal = ' '.join(line.split(' ')[1:])
		goals = []
		doc = nlp(goal)
		words = doc.sentences[0].to_dict()
		print(line.split(' '))
		print(goal)

		if ' and ' in goal.casefold() or ' or ' in goal.casefold():			
			root = [word for word in words if word['head'] == 0][0]
			goals += getGoal(root, words)
		else:
			goals = [goal]

		for goal in goals:
			self.addGoal2Tree(goal, goal_id, words)
	
	def addGoal2Tree(self, goal, goal_id, words):
		self.goal_node = NB('')
		self.goal_node.setSpec(self.markOffWithNewLine(goal))
		self.goal_node.setNote(goal_id)
		self.goal_node.setLemmas(self.getLemmasFrom(words))
		print(goal_id.split('.'), len(goal_id.split('.')), self.goal_node.getLemmas())

		if len(goal_id.split('.')) == 3:
			self.setParentFromWords()
		else:
			self.setParentFromID(goal_id)
	
	def getLemmasFrom(self, words):
		lemmas = set()
		for word in words:
			if word['upos'] in ['NOUN', 'PROPN', 'VERB', 'ADJ', 'ADV']:
				lemmas.add(word['lemma'].casefold())
		return lemmas

	def setParentFromWords(self):
		print('>>>>>> DEPTH 1 <<<<<<')
		# make a 2d list of parents, then flatten
		parents = sum([[node for node in nodes if len(node.getNote().split('.')) == 3] for nodes in self.goalmodel.getGoalsDict().values()], [])
		pre_parent = self.goalmodel.getRoot()
		max_intersect = 0
		goal_lemmas = self.goal_node.getLemmas()

		for parent in parents:
			parent_id = int(parent.getNote().split('.')[1])
			#lemmas = self.goalmodel.getGoalLemmas(parent_id)
			lemmas = parent.getLemmas()
			intersect = len(goal_lemmas.intersection(lemmas))
			if max_intersect < intersect:
				max_intersect = intersect
				pre_parent = parent
			print(f'parent_id: {parent_id}')
			print(lemmas) 
			print(goal_lemmas)
			print(intersect)
			print()
		
		self.goalmodel.addGoal(self.goal_node, pre_parent)

	def setParentFromID(self, goal_id):
		parent = self.goalmodel.getLastAddedGoal()
		while parent is not None:
			print(parent.getNote(), goal_id, goal_id.startswith(parent.getNote()) and goal_id != parent.getNote())
			if goal_id.startswith(parent.getNote()) and goal_id != parent.getNote():
				self.goalmodel.addGoal(self.goal_node, parent)
				break 
			else:
				parent = parent.getP()
				print(parent.getNote())
	
	#文をN単語ごとに改行で区切る
	def markOffWithNewLine(self, sentence):
		words = sentence.split()
		new_sentence = ''

		while words != []:
			line = ''
			while len(line) < 12 and words != []:
				line += words[0] + ' '
				words = words[1:]
			new_sentence += line + '\\n'
		
		return new_sentence.replace('\\n.','.')

	def writeLog(self):
		with open(self.__log, 'a') as f:
			logs = ''

			for log in self.logs:
				logs += log + '\n'
			f.write(logs)


nlp = stanza.Pipeline(lang='en', processors= 'tokenize,mwt,pos,lemma,depparse')