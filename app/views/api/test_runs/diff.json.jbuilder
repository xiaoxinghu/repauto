# @changes.each do |key, value|
#   json.set! key do
#     json.partial! 'api/test_cases/test_case', collection: value, as: :test_case
#   end
# end

# json.prev partial: 'api/test_cases/test_case', collection: @prev, as: :test_case
json.prev @prev, partial: 'api/test_cases/test_case', as: :test_case
json.current @current, partial: 'api/test_cases/test_case', as: :test_case
