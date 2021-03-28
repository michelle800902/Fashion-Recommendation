# -*-coding:utf-8-*-
from warnings import filterwarnings
filterwarnings(action='ignore', category=UserWarning, module='gensim')

import traceback
import os
import pickle
from gensim import *
import json

def topic_modeling(project_root=""):
    try:
        lda_path = os.path.join(project_root,
            'mining_models','topic_modeling','lda_25topics_100iterations.model')            
        lda = models.LdaModel.load(lda_path)
        topics = lda.show_topics(num_words=10, num_topics=-1, formatted=False)

        word_json = list()    
        for topic in topics:
            category = topic[0]
            words = topic[1]    
            for word in words:
                word_dict = {'word': word[0],'word_size':float(word[1]),'topic':category}
                word_json.append(word_dict)
        return word_json

    except:
        raise Exception(traceback.format_exc())

if __name__=='__main__':
    words = topic_modeling()
    for topic in words:
        for word in topic:
            print word[0],word[1]
        print "===================="

    
