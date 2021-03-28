# -*- coding: utf-8 -*-
from __future__ import absolute_import
from __future__ import unicode_literals

from django.conf import settings
from django.shortcuts import render
from django.shortcuts import render_to_response, HttpResponse
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

import os
from os.path import abspath,dirname
import glob
import operator
import traceback
import logging
import json
import time
import datetime
from datetime import datetime

from fashionAPP.mining_models import topic_modeling
from fashionAPP.mining_models import category_classification
from fashionAPP.mining_models import compatibility_classification
from fashionAPP.forms import UploadFileForm
from fashionAPP.models import UploadFile
from fashionAPP.models import Items


os.environ['TZ'] = 'Asia/Taipei'
dname = dirname(dirname(abspath(__file__)))
project_root = os.path.join(dname, "fashionAPP")


def return_response(data, ensure_ascii=True):
    # try:
    #     response_data = json.dumps(data,ensure_ascii=ensure_ascii)
    # except:
    #     print traceback.format_exc()
    response_data = json.dumps(data, ensure_ascii=ensure_ascii)
    response = HttpResponse(response_data, content_type='application/json; charset=UTF-8')
    response['Content-Length'] = len(response_data)
    return response


# http://127.0.0.1:8000/
def index(request):
    return render(request, 'index.html', {
    	'current_time': str(datetime.now())
    })


# /get_db_data/
def get_db_data(request):
    # test for query items
    try:
        # tops = []
        # for item in Items.objects.filter(category2_name='Tops'):
        #     tops.append(item.item_id)
        # return HttpResponse(tops[0])
        return_data = {}
        item_id = request.GET.get('item_id')
        for item in Items.objects.filter(item_id = item_id):
            return_data = {
                'item_id': item.item_id, 
                'title': item.title,
                'image': item.image,
                'category2_name': item.category2_name,
                'category3_name': item.category3_name,
                'category4_name': item.category4_name,
                'brand': item.brand,
                'price': item.price,
                'likes': item.likes,
                'description': item.description
            }
        return return_response(return_data, ensure_ascii=True)
    except:
        print traceback.format_exc()
        return HttpResponse('None')


# /upload_image/
def upload_image(request):
    # Remove the images uploaded before
    for i in glob.glob('upload/*'):
        os.remove(i)
    # Request POST 
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            new_file = UploadFile(file = request.FILES['file'])
            new_file.save()
            return HttpResponse('Image upload succeeded.')
        else:
            return HttpResponse("Image upload form not valid.")
    else:
        form = UploadFileForm()


# /get_image_category/
def get_image_category(request):
    try:
        result = category_classification.category_prediction(dname=dname, project_root=project_root)
        return return_response(result, ensure_ascii=True)
    except:
        print traceback.format_exc()
        return HttpResponse('None')


# /get_compatibility/
def get_compatibility(request):
    try:
        # Remove the pair images generate before
        for i in glob.glob('pairs/*'):
            os.remove(i)
        input_style = request.GET.get('input_style')
        input_category = request.GET.get('input_category')
        # result = [id of im1, id of im2, ...]
        result = compatibility_classification.compatibility_prediction(input_style, input_category, dname=dname, project_root=project_root)
        return return_response(result, ensure_ascii=True)
    except:
        print traceback.format_exc()
        return HttpResponse('None')


# /get_topic_bubble/
def get_topic_bubble(request):
    try:
        return_data = []
        for i in xrange(25):
            return_data.append({'topic': i, 'topic_size': 1})
        return return_response(return_data, ensure_ascii=True)
    except:
        print traceback.format_exc()
        return HttpResponse('None')


# /get_word_cloud/
# def get_word_cloud(request):
#     try:
#         words_json = topic_modeling.topic_modeling(project_root=project_root)
#         return_data = [ 
#                 {
#                     'topic': wj['topic'], 
#                     # 'word': wj['word'], 
#                     'word': wj['word'].encode("utf8"),
#                     # 'word': wj['word'].decode("utf8"),
#                     'word_size': wj['word_size']
#                 }
#                 for wj in words_json 
#             ]
#         return return_response(return_data, ensure_ascii=True)
#     except:
#         print traceback.format_exc()
#         return HttpResponse('None')


# /get_content/
# def get_content(request):
#     try:
#         test = request.GET.get('test')
#         return HttpResponse(test)
#     except:
#         print traceback.format_exc()
#         return HttpResponse('None')
