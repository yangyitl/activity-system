<?php
/**
 * Created by PhpStorm.
 * User: wenjunchen
 * Date: 2019-03-17
 * Time: 11:44
 */

namespace App\Http\Model;

use Illuminate\Validation\ValidationException;

class ExcException extends ValidationException
{


    public function __construct($validator, $code)
    {
        $this->response = ['msg' => $validator->messages()->first(), 'status' => $code];
        $this->validator = $validator;
    }


}
