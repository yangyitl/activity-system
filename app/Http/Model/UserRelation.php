<?php
/**
 * Created by PhpStorm.
 * User: wenjunchen
 * Date: 2019-03-17
 * Time: 11:44
 */

namespace App\Http\Model;


use Illuminate\Database\Eloquent\Model;

class UserRelation extends Model
{
    public $timestamps = true;

    public $table = 'user_relation';


}